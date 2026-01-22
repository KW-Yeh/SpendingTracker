import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { DsqlSigner } from '@aws-sdk/dsql-signer';

// Set this environment variable in your production environment
const MIGRATION_SECRET = process.env.MIGRATION_SECRET;
const DEST_DB_URL = process.env.DEST_DB_URL;

// DSQL Source Config
const {
  AURORA_DSQL_HOST,
  AURORA_DSQL_REGION,
  AURORA_DSQL_USER,
  AURORA_DSQL_DB,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

export const maxDuration = 300; // Allow 5 minutes
export const dynamic = 'force-dynamic';

async function getDsqlToken() {
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

  return await signer.getDbConnectAdminAuthToken();
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

  const logs: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  let sourceClient: Client | null = null;
  let destClient: Client | null = null;

  try {
    log('Generating DSQL Token...');
    const sourceToken = await getDsqlToken();
    
    log('Connecting to Source (DSQL)...');
    sourceClient = new Client({
      host: AURORA_DSQL_HOST,
      user: AURORA_DSQL_USER,
      password: sourceToken,
      database: AURORA_DSQL_DB,
      ssl: { rejectUnauthorized: true },
      port: 5432
    });
    await sourceClient.connect();

    log('Connecting to Destination (RDS)...');
    destClient = new Client({
      connectionString: DEST_DB_URL,
      ssl: { rejectUnauthorized: false } // RDS often needs this if using default certs or forced SSL
    });
    await destClient.connect();
    
    log('Connected to both databases.');

    // 1. Migrate Users
    log('Migrating Users...');
    const users = await sourceClient.query('SELECT * FROM users');
    for (const row of users.rows) {
      await destClient.query(
        `INSERT INTO users (user_id, name, email, avatar_url, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO NOTHING`,
        [row.user_id, row.name, row.email, row.avatar_url, row.created_at]
      );
    }
    log(`Migrated ${users.rowCount} users.`);

    // 2. Migrate Accounts
    log('Migrating Accounts...');
    const accounts = await sourceClient.query('SELECT * FROM accounts');
    for (const row of accounts.rows) {
      // Note: We ignore the 'members' JSON column here as it's redundant
      await destClient.query(
        `INSERT INTO accounts (account_id, name, owner_id, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_id) DO NOTHING`,
        [row.account_id, row.name, row.owner_id, row.created_at]
      );
    }
    log(`Migrated ${accounts.rowCount} accounts.`);

    // 3. Migrate Account Members
    log('Migrating Account Members...');
    const members = await sourceClient.query('SELECT * FROM account_members');
    for (const row of members.rows) {
      await destClient.query(
        `INSERT INTO account_members (account_id, user_id, role, joined_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_id, user_id) DO NOTHING`,
        [row.account_id, row.user_id, row.role, row.joined_at]
      );
    }
    log(`Migrated ${members.rowCount} account members.`);

    // 4. Migrate Budgets
    log('Migrating Budgets...');
    const budgets = await sourceClient.query('SELECT * FROM budgets');
    for (const row of budgets.rows) {
      let monthlyItems = '[]';
      try {
        if (typeof row.monthly_items === 'string') {
            monthlyItems = row.monthly_items;
            JSON.parse(monthlyItems);
        } else if (row.monthly_items) {
            monthlyItems = JSON.stringify(row.monthly_items);
        }
      } catch (e) {
        log(`Warning: Invalid JSON in budget ${row.budget_id}, resetting to []`);
        monthlyItems = '[]';
      }

      await destClient.query(
        `INSERT INTO budgets (budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
         ON CONFLICT (budget_id) DO NOTHING`,
        [row.budget_id, row.account_id, row.annual_budget, row.monthly_budget, monthlyItems, row.created_at, row.updated_at]
      );
    }
    log(`Migrated ${budgets.rowCount} budgets.`);

    // 5. Migrate Transactions
    log('Migrating Transactions...');
    const transactions = await sourceClient.query('SELECT * FROM transactions');
    for (const row of transactions.rows) {
      await destClient.query(
        `INSERT INTO transactions (transaction_id, account_id, recorded_by_user_id, amount, type, category, description, date, necessity, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
         ON CONFLICT (transaction_id) DO NOTHING`,
        [row.transaction_id.toString(), row.account_id, row.recorded_by_user_id, row.amount, row.type, row.category, row.description, row.date, row.necessity]
      );
    }
    log(`Migrated ${transactions.rowCount} transactions.`);

    // 6. Migrate Favorite Categories
    log('Migrating Favorite Categories...');
    const favCats = await sourceClient.query('SELECT * FROM favorite_categories');
    for (const row of favCats.rows) {
        // Handle column name mismatch if needed
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
    }
    log(`Migrated ${favCats.rowCount} favorite categories.`);
    log('Migration Complete!');

    return NextResponse.json({ success: true, logs });

  } catch (err: any) {
    console.error('Migration failed:', err);
    return NextResponse.json(
      { success: false, error: err.message, stack: err.stack, logs },
      { status: 500 }
    );
  } finally {
    if (sourceClient) await sourceClient.end();
    if (destClient) await destClient.end();
  }
}

