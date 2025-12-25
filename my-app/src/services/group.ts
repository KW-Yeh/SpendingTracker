import { getDb } from '@/utils/getAurora';

/**
 * 根據 ID 查詢群組
 */
export async function getGroupById(
  groupId: number | string,
): Promise<Group | null> {
  if (!groupId) {
    throw new Error('缺少群組 ID');
  }

  const db = await getDb();

  const query = `
    SELECT
      a.account_id,
      a.name,
      a.owner_id,
      a.members,
      a.created_at,
      u.email as owner_email,
      u.name as owner_name,
      COUNT(DISTINCT am.user_id) as member_count
    FROM accounts a
    JOIN users u ON a.owner_id = u.user_id
    LEFT JOIN account_members am ON a.account_id = am.account_id
    WHERE a.account_id = $1
    GROUP BY a.account_id, a.name, a.owner_id, a.members, a.created_at, u.email, u.name
  `;

  const result = await db.query(query, [groupId]);

  if (result.rows.length === 0) {
    return null;
  }

  const group = result.rows[0];
  // Parse members JSON string to array
  return {
    ...group,
    members:
      typeof group.members === 'string' && group.members
        ? JSON.parse(group.members)
        : group.members || [],
  };
}

/**
 * 查詢使用者參與的所有群組
 */
export async function getUserGroups(userId: number): Promise<Group[]> {
  if (!userId) {
    throw new Error('缺少使用者 ID');
  }

  const db = await getDb();

  const query = `
    SELECT
      a.account_id,
      a.name,
      a.owner_id,
      a.members,
      a.created_at,
      u.email as owner_email,
      u.name as owner_name,
      am.role as user_role,
      COUNT(DISTINCT am2.user_id) as member_count
    FROM account_members am
    JOIN accounts a ON am.account_id = a.account_id
    JOIN users u ON a.owner_id = u.user_id
    LEFT JOIN account_members am2 ON a.account_id = am2.account_id
    WHERE am.user_id = $1
    GROUP BY a.account_id, a.name, a.owner_id, a.members, a.created_at, u.email, u.name, am.role
    ORDER BY a.created_at DESC
  `;

  const result = await db.query(query, [userId]);
  // Parse members JSON string to array for each group
  return result.rows.map((group) => ({
    ...group,
    members:
      typeof group.members === 'string' && group.members
        ? JSON.parse(group.members)
        : group.members || [],
  }));
}

/**
 * 查詢使用者擁有的群組
 */
export async function getUserOwnedGroups(userId: number): Promise<Group[]> {
  if (!userId) {
    throw new Error('缺少使用者 ID');
  }

  const db = await getDb();

  const query = `
    SELECT
      a.account_id,
      a.name,
      a.owner_id,
      a.members,
      a.created_at,
      u.email as owner_email,
      u.name as owner_name,
      COUNT(DISTINCT am.user_id) as member_count
    FROM accounts a
    JOIN users u ON a.owner_id = u.user_id
    LEFT JOIN account_members am ON a.account_id = am.account_id
    WHERE a.owner_id = $1
    GROUP BY a.account_id, a.name, a.owner_id, a.members, a.created_at, u.email, u.name
    ORDER BY a.created_at DESC
  `;

  const result = await db.query(query, [userId]);
  // Parse members JSON string to array for each group
  return result.rows.map((group) => ({
    ...group,
    members:
      typeof group.members === 'string' && group.members
        ? JSON.parse(group.members)
        : group.members || [],
  }));
}

/**
 * 建立新群組
 */
export async function createGroup(data: {
  account_id: number;
  name: string;
  owner_id: number;
}): Promise<Group> {
  const { account_id, name, owner_id } = data;

  if (!account_id || !name || !owner_id) {
    throw new Error('缺少必要欄位');
  }

  const db = await getDb();

  try {
    // 開始交易
    await db.query('BEGIN');

    // 建立群組
    const createQuery = `
      INSERT INTO accounts (account_id, name, owner_id, members)
      VALUES ($1, $2, $3, $4)
      RETURNING account_id, name, owner_id, members, created_at
    `;

    const accountResult = await db.query(createQuery, [
      account_id,
      name,
      owner_id,
      JSON.stringify([owner_id]),
    ]);
    const account = accountResult.rows[0];

    // Parse members JSON string to array
    if (account.members) {
      account.members = typeof account.members === 'string'
        ? JSON.parse(account.members)
        : account.members;
    }

    // 自動將擁有者加入成員
    const memberQuery = `
      INSERT INTO account_members (account_id, user_id, role)
      VALUES ($1, $2, 'Owner')
    `;

    await db.query(memberQuery, [account_id, owner_id]);

    // 提交交易
    await db.query('COMMIT');

    return account;
  } catch (error) {
    // 回滾交易
    await db.query('ROLLBACK');
    throw error;
  }
}

/**
 * 更新群組資訊
 */
export async function updateGroup(
  groupId: number,
  data: { name?: string; owner_id?: number },
): Promise<Group> {
  if (!groupId) {
    throw new Error('缺少群組 ID');
  }

  const db = await getDb();

  // 動態建構 SET 子句
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex}`);
    values.push(data.name);
    paramIndex++;
  }

  if (data.owner_id !== undefined) {
    updates.push(`owner_id = $${paramIndex}`);
    values.push(data.owner_id);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error('沒有要更新的欄位');
  }

  values.push(groupId);

  const query = `
    UPDATE accounts
    SET ${updates.join(', ')}
    WHERE account_id = $${paramIndex}
    RETURNING account_id, name, owner_id, members, created_at
  `;

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('找不到該群組');
  }

  const group = result.rows[0];
  // Parse members JSON string to array
  return {
    ...group,
    members:
      typeof group.members === 'string' && group.members
        ? JSON.parse(group.members)
        : group.members || [],
  };
}

/**
 * 刪除群組
 */
export async function deleteGroup(
  groupId: number,
): Promise<{ account_id: number }> {
  if (!groupId) {
    throw new Error('缺少群組 ID');
  }

  const db = await getDb();

  try {
    await db.query('BEGIN');

    // 刪除成員關聯
    await db.query('DELETE FROM account_members WHERE account_id = $1', [
      groupId,
    ]);

    // 刪除群組（注意：這會保留交易記錄，如果要一併刪除需要另外處理）
    const query = `
      DELETE FROM accounts
      WHERE account_id = $1
      RETURNING account_id
    `;

    const result = await db.query(query, [groupId]);

    if (result.rows.length === 0) {
      throw new Error('找不到該群組');
    }

    await db.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

/**
 * 查詢群組成員
 */
export async function getGroupMembers(groupId: number): Promise<GroupMember[]> {
  if (!groupId) {
    throw new Error('缺少群組 ID');
  }

  const db = await getDb();

  const query = `
    SELECT 
      am.account_id,
      am.user_id,
      am.role,
      am.joined_at,
      u.email,
      u.name
    FROM account_members am
    JOIN users u ON am.user_id = u.user_id
    WHERE am.account_id = $1
    ORDER BY 
      CASE am.role 
        WHEN 'Owner' THEN 1
        WHEN 'Editor' THEN 2
        WHEN 'Viewer' THEN 3
        ELSE 4
      END,
      am.joined_at ASC
  `;

  const result = await db.query(query, [groupId]);
  return result.rows;
}

/**
 * 新增群組成員
 */
export async function addGroupMember(data: {
  account_id: number;
  user_id: number;
  role: string;
}): Promise<GroupMember> {
  const { account_id, user_id, role } = data;

  if (!account_id || !user_id || !role) {
    throw new Error('缺少必要欄位');
  }

  // 驗證角色
  const validRoles = ['Owner', 'Editor', 'Viewer'];
  if (!validRoles.includes(role)) {
    throw new Error('無效的角色');
  }

  const db = await getDb();

  const query = `
    INSERT INTO account_members (account_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (account_id, user_id) 
    DO UPDATE SET role = EXCLUDED.role
    RETURNING account_id, user_id, role, joined_at
  `;

  const result = await db.query(query, [account_id, user_id, role]);
  return result.rows[0];
}

/**
 * 更新成員角色
 */
export async function updateMemberRole(
  accountId: number,
  userId: number,
  newRole: string,
): Promise<GroupMember> {
  if (!accountId || !userId || !newRole) {
    throw new Error('缺少必要欄位');
  }

  const validRoles = ['Owner', 'Editor', 'Viewer'];
  if (!validRoles.includes(newRole)) {
    throw new Error('無效的角色');
  }

  const db = await getDb();

  const query = `
    UPDATE account_members
    SET role = $1
    WHERE account_id = $2 AND user_id = $3
    RETURNING account_id, user_id, role, joined_at
  `;

  const result = await db.query(query, [newRole, accountId, userId]);

  if (result.rows.length === 0) {
    throw new Error('找不到該成員');
  }

  return result.rows[0];
}

/**
 * 移除群組成員
 */
export async function removeGroupMember(
  accountId: number,
  userId: number,
): Promise<{ account_id: number; user_id: number }> {
  if (!accountId || !userId) {
    throw new Error('缺少必要欄位');
  }

  const db = await getDb();

  // 檢查是否為擁有者
  const checkQuery = `
    SELECT role FROM account_members
    WHERE account_id = $1 AND user_id = $2
  `;
  const checkResult = await db.query(checkQuery, [accountId, userId]);

  if (checkResult.rows.length > 0 && checkResult.rows[0].role === 'Owner') {
    throw new Error('無法移除群組擁有者');
  }

  const query = `
    DELETE FROM account_members
    WHERE account_id = $1 AND user_id = $2
    RETURNING account_id, user_id
  `;

  const result = await db.query(query, [accountId, userId]);

  if (result.rows.length === 0) {
    throw new Error('找不到該成員');
  }

  return result.rows[0];
}
