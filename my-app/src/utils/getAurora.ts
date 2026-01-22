import 'server-only';
import { DsqlSigner } from '@aws-sdk/dsql-signer';
import { Client, Pool } from 'pg';

const {
  AURORA_DSQL_HOST,
  AURORA_DSQL_PORT,
  AURORA_DSQL_REGION,
  AURORA_DSQL_DB,
  AURORA_DSQL_USER,
  // Add support for standard POSTGRES/RDS URL
  DATABASE_URL, 
  // OR standard individual vars
  PGHOST,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
  PGPORT
} = process.env;

// Cached token with expiration (Only for DSQL)
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getPassword() {
  // If we have a static password (RDS/Postgres), use it.
  if (PGPASSWORD) return PGPASSWORD;
  
  // If we are using DSQL, we generate the token
  if (!AURORA_DSQL_HOST) return ''; // Should not happen if config is correct

  const now = Date.now();
  // Reuse token if still valid (tokens typically valid for 15 minutes)
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  // DSQL Signer
  const signer = new DsqlSigner({
    hostname: AURORA_DSQL_HOST!,
    region: AURORA_DSQL_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const token = await signer.getDbConnectAdminAuthToken();

  // Cache token for 10 minutes (to be safe, tokens are valid for 15)
  cachedToken = {
    token,
    expiresAt: now + 10 * 60 * 1000,
  };

  return token;
}

// Global connection pool (singleton)
let pool: Pool | null = null;

/**
 * Get a connection pool (optimized for performance)
 * Supports both DSQL (via dynamic token) and RDS (via static password/URL)
 */
export async function getPool(): Promise<Pool> {
  if (!pool) {
    // 1. If DATABASE_URL is provided, use it directly (Simplest for RDS)
    if (DATABASE_URL) {
        pool = new Pool({
            connectionString: DATABASE_URL,
            ssl: { rejectUnauthorized: false } // RDS often uses self-signed or needs bundle
        });
        return pool;
    }

    // 2. Otherwise construct connection
    const password = await getPassword();
    const host = PGHOST || AURORA_DSQL_HOST;
    const user = PGUSER || AURORA_DSQL_USER;
    const dbName = PGDATABASE || AURORA_DSQL_DB;
    const port = Number(PGPORT || AURORA_DSQL_PORT || 5432);

    pool = new Pool({
      host: host!,
      port: port,
      user: user!,
      password,
      database: dbName!,
      ssl: { rejectUnauthorized: false }, // Relaxed SSL for broader compatibility
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // If using DSQL (no static PGPASSWORD), set up token refresh
    if (!PGPASSWORD && !DATABASE_URL && AURORA_DSQL_HOST) {
        setInterval(async () => {
        try {
            const newPassword = await getPassword();
            if (pool) {
            // Note: pg-pool doesn't support changing password dynamically for existing clients easily.
            // But we can create a new pool.
            // For simplicity in this DSQL implementation, we might need a more complex rotation if connections persist long.
            // But `pg` pool usually grabs password from config. 
            // Actually, once initialized, the pool uses the same config. 
            // So we really do need to destroy/recreate or use a function for password (if pg supported it, which it commonly doesn't in config object).
            // The previous implementation drained the pool. We keep that logic.
            await pool.end();
            pool = new Pool({
                host: AURORA_DSQL_HOST!,
                port: Number(AURORA_DSQL_PORT ?? 5432),
                user: AURORA_DSQL_USER!,
                password: newPassword,
                database: AURORA_DSQL_DB!,
                ssl: { rejectUnauthorized: false },
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 5000,
            });
            }
        } catch (error) {
            console.error('[getAurora] Token refresh failed:', error);
        }
        }, 9 * 60 * 1000); // Refresh every 9 minutes
    }
  }

  return pool;
}

/**
 * Get a database client
 */
export async function getDb() {
  // If DATABASE_URL is set, use it
  if (DATABASE_URL) {
      const client = new Client({
          connectionString: DATABASE_URL,
          ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      return client;
  }

  const password = await getPassword();
  const host = PGHOST || AURORA_DSQL_HOST;
  const user = PGUSER || AURORA_DSQL_USER;
  const dbName = PGDATABASE || AURORA_DSQL_DB;
  const port = Number(PGPORT || AURORA_DSQL_PORT || 5432);

  const client = new Client({
    host: host!,
    port: port,
    user: user!,
    password,
    database: dbName!,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  return client;
}

