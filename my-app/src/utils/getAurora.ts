import 'server-only';
import { DsqlSigner } from '@aws-sdk/dsql-signer';
import { Client, Pool } from 'pg';

const {
  AURORA_DSQL_HOST,
  AURORA_DSQL_PORT,
  AURORA_DSQL_REGION,
  AURORA_DSQL_DB,
  AURORA_DSQL_USER,
} = process.env;

// Cached token with expiration
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getPassword() {
  const now = Date.now();

  // Reuse token if still valid (tokens typically valid for 15 minutes)
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

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
 * Uses connection pooling and token caching
 */
export async function getPool(): Promise<Pool> {
  if (!pool) {
    const password = await getPassword();

    pool = new Pool({
      host: AURORA_DSQL_HOST!,
      port: Number(AURORA_DSQL_PORT ?? 5432),
      user: AURORA_DSQL_USER!,
      password,
      database: AURORA_DSQL_DB!,
      ssl: { rejectUnauthorized: true },
      max: 20,                    // Maximum pool size
      idleTimeoutMillis: 30000,   // Close idle clients after 30s
      connectionTimeoutMillis: 2000, // Fail fast if no connection available
    });

    // Refresh token before expiration
    setInterval(async () => {
      try {
        const newPassword = await getPassword();
        if (pool) {
          // Drain pool and recreate with new password
          await pool.end();
          pool = new Pool({
            host: AURORA_DSQL_HOST!,
            port: Number(AURORA_DSQL_PORT ?? 5432),
            user: AURORA_DSQL_USER!,
            password: newPassword,
            database: AURORA_DSQL_DB!,
            ssl: { rejectUnauthorized: true },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          });
        }
      } catch (error) {
        console.error('[getAurora] Token refresh failed:', error);
      }
    }, 9 * 60 * 1000); // Refresh every 9 minutes
  }

  return pool;
}

/**
 * Get a database client (legacy, for backward compatibility)
 * Note: This creates a new connection each time. Use getPool() for better performance.
 */
export async function getDb() {
  const password = await getPassword();

  const client = new Client({
    host: AURORA_DSQL_HOST!,
    port: Number(AURORA_DSQL_PORT ?? 5432),
    user: AURORA_DSQL_USER!,
    password,
    database: AURORA_DSQL_DB!,
    ssl: { rejectUnauthorized: true },
  });

  await client.connect();
  return client;
}
