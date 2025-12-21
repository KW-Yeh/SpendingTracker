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

async function getPassword() {
  // Try to get an IAM auth token via DsqlSigner. This will require
  // valid AWS credentials available in the environment (or via the
  // runtime's metadata service / integration).
  const signer = new DsqlSigner({
    hostname: AURORA_DSQL_HOST!,
    region: AURORA_DSQL_REGION!,
  });
  return await signer.getDbConnectAdminAuthToken();
}

export async function getDb() {
  // If a direct password is provided (useful in environments where
  // generating an IAM auth token isn't possible), prefer it.
  // Set AURORA_DSQL_PASSWORD in Vercel environment variables to use this.
  let password: string | undefined = process.env.AURORA_DSQL_PASSWORD;

  if (!password) {
    try {
      password = await getPassword();
    } catch (err) {
      // Surface a clear error so logs show whether IAM token generation failed.
      console.error('Failed to obtain IAM auth token for Aurora DSQL:', err);
      throw err;
    }
  }

  const client = new Client({
    host: AURORA_DSQL_HOST!,
    port: Number(AURORA_DSQL_PORT ?? 5432),
    user: AURORA_DSQL_USER!,
    password,
    database: AURORA_DSQL_DB!,
    ssl: { rejectUnauthorized: true },
  });

  try {
    await client.connect();
    return client;
  } catch (err) {
    console.error('Postgres client.connect() failed:', err);
    throw err;
  }
}
