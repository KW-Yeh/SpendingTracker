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
  const signer = new DsqlSigner({
    hostname: AURORA_DSQL_HOST!,
    region: AURORA_DSQL_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  return await signer.getDbConnectAdminAuthToken();
}

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
