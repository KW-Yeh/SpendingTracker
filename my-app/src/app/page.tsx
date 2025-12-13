import { getDb } from '@/utils/getAurora';

export default async function Home() {
  const db = await getDb();
  try {
    const result = await db.query('SELECT NOW()');
    return (
      <h1>
        Test AWS Aurora DSQL Connection:{' '}
        {new Date(result.rows[0].now).toString()}
      </h1>
    );
  } finally {
    await db.end();
  }
}
