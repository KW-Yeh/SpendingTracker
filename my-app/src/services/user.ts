import { getDb } from '@/utils/getAurora';

/**
 * 根據 Email 查詢使用者
 */
export async function getUser(email: string): Promise<User | null> {
  if (!email) {
    throw new Error('缺少 Email 資訊');
  }

  const db = await getDb();

  const query = `
    SELECT 
      user_id,
      email,
      name,
      created_at
    FROM users
    WHERE email = $1
  `;

  const result = await db.query(query, [email]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * 建立新使用者（明確指定 user_id）
 */
export async function createUser(data: User): Promise<User> {
  const { user_id, email, name } = data;

  if (!user_id || !email) {
    throw new Error('缺少必要欄位');
  }

  const db = await getDb();

  const query = `
    INSERT INTO users (user_id, email, name)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING user_id, email, name, created_at
  `;

  const result = await db.query(query, [user_id, email, name]);

  if (result.rows.length === 0) {
    throw new Error('使用者 ID 已存在');
  }

  return result.rows[0];
}

/**
 * 更新使用者資料
 */
export async function putUser(
  userId: number,
  data: Partial<User>,
): Promise<User> {
  if (!userId) {
    throw new Error('缺少使用者 ID');
  }

  const db = await getDb();

  // 動態建構 SET 子句
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.email !== undefined) {
    updates.push(`email = $${paramIndex}`);
    values.push(data.email);
    paramIndex++;
  }

  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex}`);
    values.push(data.name);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error('沒有要更新的欄位');
  }

  values.push(userId);

  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE user_id = $${paramIndex}
    RETURNING user_id, email, name, created_at
  `;

  console.log('Executing query:', query);
  console.log('With values:', values);

  const result = await db.query(query, values);

  console.log('Query result:', result);

  if (result.rows.length === 0) {
    throw new Error('找不到該使用者');
  }

  return result.rows[0];
}

/**
 * 刪除使用者
 */
export async function deleteUser(userId: number): Promise<{ user_id: number }> {
  if (!userId) {
    throw new Error('缺少使用者 ID');
  }

  const db = await getDb();

  const query = `
    DELETE FROM users
    WHERE user_id = $1
    RETURNING user_id
  `;

  const result = await db.query(query, [userId]);

  if (result.rows.length === 0) {
    throw new Error('找不到該使用者');
  }

  return result.rows[0];
}
