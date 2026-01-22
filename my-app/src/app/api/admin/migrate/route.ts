import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { DsqlSigner } from '@aws-sdk/dsql-signer';

const MIGRATION_SECRET = process.env.MIGRATION_SECRET;
const DEST_DB_URL = process.env.DEST_DB_URL;

// DSQL source config (explicitly for migration, not shared with getDb which uses DATABASE_URL)
const {
  AURORA_DSQL_HOST,
  AURORA_DSQL_REGION,
  AURORA_DSQL_USER,
  AURORA_DSQL_DB,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

// Get a client connected to DSQL source database
async function getDsqlClient(): Promise<Client> {
  if (!AURORA_DSQL_HOST || !AURORA_DSQL_REGION) {
    throw new Error('Missing AURORA_DSQL_HOST or AURORA_DSQL_REGION');
  }

  const signer = new DsqlSigner({
    hostname: AURORA_DSQL_HOST,
    region: AURORA_DSQL_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID || '',
      secretAccessKey: AWS_SECRET_ACCESS_KEY || ''
    }
  });

  const token = await signer.getDbConnectAdminAuthToken();

  const client = new Client({
    host: AURORA_DSQL_HOST,
    port: 5432,
    user: AURORA_DSQL_USER,
    password: token,
    database: AURORA_DSQL_DB,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  return client;
}

export const maxDuration = 60; // Vercel hobby plan limit
export const dynamic = 'force-dynamic';

// Tables in migration order (respects FK dependencies)
const TABLES_IN_ORDER = [
  'users',
  'accounts',
  'account_members',
  'budgets',
  'transactions',
  'favorite_categories'
] as const;

type TableName = typeof TABLES_IN_ORDER[number];

const DEFAULT_BATCH_SIZES: Record<TableName, number> = {
  users: 1000,
  accounts: 1000,
  account_members: 1000,
  budgets: 500,
  transactions: 500,
  favorite_categories: 1000
};

const PRIMARY_KEYS: Record<TableName, string> = {
  users: 'user_id',
  accounts: 'account_id',
  account_members: 'account_id, user_id',
  budgets: 'budget_id',
  transactions: 'transaction_id',
  favorite_categories: 'category_id'
};

async function initMigrationProgress(destClient: Client) {
  // Create table if not exists
  await destClient.query(`
    CREATE TABLE IF NOT EXISTS migration_progress (
      table_name VARCHAR(100) PRIMARY KEY,
      total_rows INTEGER DEFAULT 0,
      migrated_rows INTEGER DEFAULT 0,
      last_offset INTEGER DEFAULT 0,
      status VARCHAR(50) DEFAULT 'pending',
      started_at TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Initialize rows for all tables
  for (const table of TABLES_IN_ORDER) {
    await destClient.query(`
      INSERT INTO migration_progress (table_name, status)
      VALUES ($1, 'pending')
      ON CONFLICT (table_name) DO NOTHING
    `, [table]);
  }
}

async function getMigrationStatus(sourceClient: Client, destClient: Client) {
  await initMigrationProgress(destClient);

  const result = await destClient.query(`
    SELECT * FROM migration_progress ORDER BY
      CASE table_name
        WHEN 'users' THEN 1
        WHEN 'accounts' THEN 2
        WHEN 'account_members' THEN 3
        WHEN 'budgets' THEN 4
        WHEN 'transactions' THEN 5
        WHEN 'favorite_categories' THEN 6
      END
  `);

  const tables = [];
  let totalRows = 0;
  let totalMigrated = 0;

  for (const row of result.rows) {
    // Get actual count from source if not set
    let sourceCount = row.total_rows;
    if (sourceCount === 0 && row.status !== 'completed') {
      const countResult = await sourceClient.query(`SELECT COUNT(*) FROM ${row.table_name}`);
      sourceCount = parseInt(countResult.rows[0].count, 10);
      await destClient.query(
        'UPDATE migration_progress SET total_rows = $1, updated_at = CURRENT_TIMESTAMP WHERE table_name = $2',
        [sourceCount, row.table_name]
      );
    }

    totalRows += sourceCount;
    totalMigrated += row.migrated_rows;

    tables.push({
      name: row.table_name,
      status: row.status,
      totalRows: sourceCount,
      migratedRows: row.migrated_rows,
      lastOffset: row.last_offset,
      progress: sourceCount > 0 ? Math.round((row.migrated_rows / sourceCount) * 100) : 0
    });
  }

  // Find next batch to process
  let nextBatch = null;
  for (const table of tables) {
    if (table.status !== 'completed') {
      nextBatch = {
        table: table.name,
        offset: table.lastOffset,
        limit: DEFAULT_BATCH_SIZES[table.name as TableName]
      };
      break;
    }
  }

  return {
    success: true,
    overallProgress: totalRows > 0 ? Math.round((totalMigrated / totalRows) * 100) : 0,
    tables,
    nextBatch
  };
}

async function resetMigration(destClient: Client) {
  await destClient.query(`
    UPDATE migration_progress
    SET status = 'pending', migrated_rows = 0, last_offset = 0,
        started_at = NULL, completed_at = NULL, updated_at = CURRENT_TIMESTAMP
  `);
  return { success: true, message: 'Migration progress reset' };
}

async function insertRow(destClient: Client, tableName: TableName, row: Record<string, unknown>) {
  switch (tableName) {
    case 'users':
      await destClient.query(
        `INSERT INTO users (user_id, name, email, avatar_url, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO NOTHING`,
        [row.user_id, row.name, row.email, row.avatar_url, row.created_at]
      );
      break;

    case 'accounts':
      await destClient.query(
        `INSERT INTO accounts (account_id, name, owner_id, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_id) DO NOTHING`,
        [row.account_id, row.name, row.owner_id, row.created_at]
      );
      break;

    case 'account_members':
      await destClient.query(
        `INSERT INTO account_members (account_id, user_id, role, joined_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_id, user_id) DO NOTHING`,
        [row.account_id, row.user_id, row.role, row.joined_at]
      );
      break;

    case 'budgets': {
      let monthlyItems = '[]';
      try {
        if (typeof row.monthly_items === 'string') {
          monthlyItems = row.monthly_items;
          JSON.parse(monthlyItems);
        } else if (row.monthly_items) {
          monthlyItems = JSON.stringify(row.monthly_items);
        }
      } catch {
        monthlyItems = '[]';
      }
      await destClient.query(
        `INSERT INTO budgets (budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
         ON CONFLICT (budget_id) DO NOTHING`,
        [row.budget_id, row.account_id, row.annual_budget, row.monthly_budget, monthlyItems, row.created_at, row.updated_at]
      );
      break;
    }

    case 'transactions':
      await destClient.query(
        `INSERT INTO transactions (transaction_id, account_id, recorded_by_user_id, amount, type, category, description, date, necessity, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
         ON CONFLICT (transaction_id) DO NOTHING`,
        [String(row.transaction_id), row.account_id, row.recorded_by_user_id, row.amount, row.type, row.category, row.description, row.date, row.necessity]
      );
      break;

    case 'favorite_categories': {
      const investment = row.investment || row.investments || '';
      await destClient.query(
        `INSERT INTO favorite_categories (
          category_id, owner_id, food, clothing, housing, transportation,
          education, entertainment, daily, medical, investment, other,
          salary, bonus, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (category_id) DO NOTHING`,
        [
          row.category_id, row.owner_id, row.food, row.clothing, row.housing, row.transportation,
          row.education, row.entertainment, row.daily, row.medical, investment, row.other,
          row.salary, row.bonus, row.created_at, row.updated_at
        ]
      );
      break;
    }
  }
}

async function migrateTableBatch(
  sourceClient: Client,
  destClient: Client,
  tableName: TableName,
  offset: number,
  limit: number,
  logs: string[]
) {
  const startTime = Date.now();
  const MAX_EXECUTION_MS = 50000; // 50s, leave 10s buffer

  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  // Mark as in_progress if first batch
  if (offset === 0) {
    await destClient.query(
      `UPDATE migration_progress SET status = 'in_progress', started_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE table_name = $1`,
      [tableName]
    );
  }

  // Get total count
  const countResult = await sourceClient.query(`SELECT COUNT(*) FROM ${tableName}`);
  const totalRows = parseInt(countResult.rows[0].count, 10);

  // Fetch batch from source
  const primaryKey = PRIMARY_KEYS[tableName];
  const rows = await sourceClient.query(
    `SELECT * FROM ${tableName} ORDER BY ${primaryKey} LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  log(`Migrating ${tableName}: offset=${offset}, fetched=${rows.rowCount} rows`);

  let migratedCount = 0;
  for (const row of rows.rows) {
    // Check timeout
    if (Date.now() - startTime > MAX_EXECUTION_MS) {
      log(`Timeout approaching, stopping at ${migratedCount} rows`);
      break;
    }

    await insertRow(destClient, tableName, row);
    migratedCount++;
  }

  // Update progress
  const newOffset = offset + migratedCount;
  const previousMigrated = await destClient.query(
    'SELECT migrated_rows FROM migration_progress WHERE table_name = $1',
    [tableName]
  );
  const newMigratedTotal = (previousMigrated.rows[0]?.migrated_rows || 0) + migratedCount;

  const tableCompleted = newOffset >= totalRows;

  await destClient.query(
    `UPDATE migration_progress
     SET migrated_rows = $1, last_offset = $2, total_rows = $3,
         status = $4, completed_at = $5, updated_at = CURRENT_TIMESTAMP
     WHERE table_name = $6`,
    [
      newMigratedTotal,
      newOffset,
      totalRows,
      tableCompleted ? 'completed' : 'in_progress',
      tableCompleted ? new Date() : null,
      tableName
    ]
  );

  log(`Batch complete: migrated=${migratedCount}, tableCompleted=${tableCompleted}`);

  // Determine next batch
  let nextBatch = null;
  if (!tableCompleted) {
    nextBatch = { table: tableName, offset: newOffset, limit };
  } else {
    // Find next table
    const tableIndex = TABLES_IN_ORDER.indexOf(tableName);
    if (tableIndex < TABLES_IN_ORDER.length - 1) {
      const nextTable = TABLES_IN_ORDER[tableIndex + 1];
      nextBatch = { table: nextTable, offset: 0, limit: DEFAULT_BATCH_SIZES[nextTable] };
    }
  }

  return {
    success: true,
    table: tableName,
    offset,
    limit,
    rowsMigrated: migratedCount,
    totalRows,
    tableCompleted,
    nextBatch,
    elapsedMs: Date.now() - startTime,
    logs
  };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-migration-secret');
  const querySecret = req.nextUrl.searchParams.get('secret');

  if (!MIGRATION_SECRET) {
    return NextResponse.json({ error: 'MIGRATION_SECRET not set' }, { status: 500 });
  }

  if (authHeader !== MIGRATION_SECRET && querySecret !== MIGRATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!DEST_DB_URL) {
    return NextResponse.json({ error: 'DEST_DB_URL not set' }, { status: 500 });
  }

  const action = req.nextUrl.searchParams.get('action') || 'status';
  const table = req.nextUrl.searchParams.get('table') as TableName | null;
  const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0', 10);
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '500', 10);

  const logs: string[] = [];
  let sourceClient: Client | null = null;
  let destClient: Client | null = null;

  try {
    // Connect to destination
    destClient = new Client({
      connectionString: DEST_DB_URL,
      ssl: { rejectUnauthorized: false }
    });
    await destClient.connect();

    // Handle reset action (doesn't need source)
    if (action === 'reset') {
      const result = await resetMigration(destClient);
      return NextResponse.json(result);
    }

    // Connect to DSQL source database
    sourceClient = await getDsqlClient();

    if (action === 'status') {
      const status = await getMigrationStatus(sourceClient, destClient);
      return NextResponse.json(status);
    }

    if (action === 'migrate') {
      if (!table || !TABLES_IN_ORDER.includes(table)) {
        return NextResponse.json(
          { error: `Invalid table. Must be one of: ${TABLES_IN_ORDER.join(', ')}` },
          { status: 400 }
        );
      }

      const result = await migrateTableBatch(sourceClient, destClient, table, offset, limit, logs);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action. Use: status, migrate, or reset' }, { status: 400 });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack, logs },
      { status: 500 }
    );
  } finally {
    if (sourceClient) await sourceClient.end();
    if (destClient) await destClient.end();
  }
}
