import { getDb } from '@/utils/getAurora';

/**
 * 查詢交易記錄
 */
export async function getItems(params: {
  groupId?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
}): Promise<SpendingRecord[]> {
  const { groupId, email, startDate, endDate } = params;

  // console.log('[DB getItems] Query params:', { groupId, email, startDate, endDate });

  if (!groupId && !email) {
    throw new Error('缺少群組 ID 或信箱資訊');
  }

  const db = await getDb();

  // 建構查詢
  let query = `
    SELECT 
      t.transaction_id as id,
      t.necessity,
      t."date",
      t.category,
      t.amount,
      t.description,
      t.type,
      t.account_id as "groupId",
      u.email as "user-token",
      t.updated_at
    FROM transactions t
    JOIN users u ON t.recorded_by_user_id = u.user_id
    WHERE 1=1
  `;

  const queryParams: any[] = [];
  let paramIndex = 1;

  // 根據 groupId 或 email 篩選
  if (groupId) {
    query += ` AND t.account_id = $${paramIndex}`;
    queryParams.push(parseInt(groupId));
    paramIndex++;
  } else if (email) {
    query += ` AND u.email = $${paramIndex}`;
    queryParams.push(email);
    paramIndex++;
  }

  // 日期範圍篩選
  if (startDate) {
    query += ` AND t."date" >= $${paramIndex}`;
    queryParams.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    query += ` AND t."date" <= $${paramIndex}`;
    queryParams.push(endDate);
    paramIndex++;
  }

  query += ` ORDER BY t."date" DESC`;
  // console.log('[DB getItems] Executing query with params:', queryParams);
  const result = await db.query(query, queryParams);
  // console.log('[DB getItems] ✅ Found', result.rows.length, 'transactions');
  return result.rows;
}

/**
 * 新增或更新交易記錄
 */
export async function putItem(data: SpendingRecord): Promise<{ id: string }> {
  const {
    id,
    necessity,
    date,
    category,
    amount,
    description,
    type,
    groupId,
    'user-token': userToken,
  } = data;

  // 驗證必要欄位
  if (!id || !necessity || !date || !amount || !type) {
    throw new Error('缺少必要欄位');
  }

  const pool = await getDb();

  // 查詢 user_id
  let userId = 1; // 預設值
  if (userToken) {
    const userResult = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [userToken],
    );
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].user_id;
    }
  }

  // 使用 UPSERT (INSERT ... ON CONFLICT)
  const query = `
    INSERT INTO transactions (
      transaction_id,
      account_id,
      recorded_by_user_id,
      necessity,
      "date",
      category,
      amount,
      description,
      type,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    ON CONFLICT (transaction_id)
    DO UPDATE SET
      necessity = EXCLUDED.necessity,
      "date" = EXCLUDED."date",
      category = EXCLUDED.category,
      amount = EXCLUDED.amount,
      description = EXCLUDED.description,
      type = EXCLUDED.type,
      updated_at = NOW()
    RETURNING transaction_id as id, updated_at
  `;

  const queryParams = [
    id,
    groupId || 1, // 預設 account_id = 1
    userId,
    necessity,
    date,
    category,
    amount,
    description,
    type,
  ];

  const result = await pool.query(query, queryParams);
  return result.rows[0];
}

/**
 * 刪除交易記錄
 */
export async function deleteItem(id: string): Promise<{ id: string }> {
  if (!id) {
    throw new Error('缺少項目 ID');
  }

  const db = await getDb();

  const query = `
    DELETE FROM transactions 
    WHERE transaction_id = $1
    RETURNING transaction_id as id
  `;

  const result = await db.query(query, [id]);

  if (result.rowCount === 0) {
    throw new Error('找不到該項目');
  }

  return result.rows[0];
}
