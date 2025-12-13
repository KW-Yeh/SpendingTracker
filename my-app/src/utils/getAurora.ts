import 'server-only';
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { DsqlSigner } from '@aws-sdk/dsql-signer';
import { Client } from 'pg';

const {
  AWS_ROLE_ARN,
  AURORA_DSQL_HOST,
  AURORA_DSQL_PORT,
  AURORA_DSQL_REGION,
  AURORA_DSQL_DB,
  AURORA_DSQL_USER,
} = process.env;

async function getPassword() {
  // if (process.env.VERCEL) {
  //   const creds = await awsCredentialsProvider({
  //     roleArn: AWS_ROLE_ARN!,
  //   });
  //   const signer = new DsqlSigner({
  //     hostname: AURORA_DSQL_HOST!,
  //     region: AURORA_DSQL_REGION!,
  //     credentials: creds,
  //   });
  //   return await signer.getDbConnectAdminAuthToken();
  // }

  const signer = new DsqlSigner({
    hostname: AURORA_DSQL_HOST!,
    region: AURORA_DSQL_REGION!,
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
