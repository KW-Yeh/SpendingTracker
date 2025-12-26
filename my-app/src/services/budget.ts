import { getDb } from '@/utils/getAurora';

/**
 * 查詢預算資料
 */
export async function getBudget(accountId: number | string): Promise<Budget | null> {
  if (!accountId) {
    throw new Error('缺少帳本 ID');
  }

  const db = await getDb();

  const query = `
    SELECT
      budget_id,
      account_id,
      annual_budget,
      monthly_budget,
      monthly_items,
      created_at,
      updated_at
    FROM budgets
    WHERE account_id = $1
  `;

  const result = await db.query(query, [Number(accountId)]);

  if (result.rows.length === 0) {
    return null;
  }

  // Parse JSON string to array
  const budget = result.rows[0];
  return {
    ...budget,
    monthly_items:
      typeof budget.monthly_items === 'string'
        ? JSON.parse(budget.monthly_items)
        : budget.monthly_items || [],
  };
}

/**
 * 建立或更新預算 (UPSERT)
 * 自動計算 monthly_budget 為 monthly_items 的總和
 */
export async function putBudget(data: {
  budget_id?: number;
  account_id: number;
  annual_budget: number;
  monthly_items: MonthlyBudgetItem[];
}): Promise<Budget> {
  const { budget_id, account_id, annual_budget, monthly_items } = data;

  if (
    !account_id ||
    annual_budget === undefined ||
    !Array.isArray(monthly_items)
  ) {
    throw new Error('缺少必要欄位');
  }

  // Calculate monthly_budget as sum of current month's items
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthly_budget = monthly_items.reduce((sum, item) => {
    const monthAmount = item.months?.[currentMonth.toString()] || 0;
    return sum + monthAmount;
  }, 0);

  const db = await getDb();
  const monthlyItemsJson = JSON.stringify(monthly_items);

  // Check if budget exists for this account
  const checkQuery = `SELECT budget_id FROM budgets WHERE account_id = $1`;
  const existingBudget = await db.query(checkQuery, [account_id]);

  let result;

  if (existingBudget.rows.length > 0) {
    // Update existing budget
    const updateQuery = `
      UPDATE budgets
      SET annual_budget = $1,
          monthly_budget = $2,
          monthly_items = $3,
          updated_at = NOW()
      WHERE account_id = $4
      RETURNING budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at
    `;
    result = await db.query(updateQuery, [
      annual_budget,
      monthly_budget,
      monthlyItemsJson,
      account_id,
    ]);
  } else {
    // Insert new budget
    const budgetId = budget_id || Date.now();
    const insertQuery = `
      INSERT INTO budgets (
        budget_id,
        account_id,
        annual_budget,
        monthly_budget,
        monthly_items,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at
    `;
    result = await db.query(insertQuery, [
      budgetId,
      account_id,
      annual_budget,
      monthly_budget,
      monthlyItemsJson,
    ]);
  }

  const budget = result.rows[0];
  return {
    ...budget,
    monthly_items:
      typeof budget.monthly_items === 'string'
        ? JSON.parse(budget.monthly_items)
        : budget.monthly_items,
  };
}

/**
 * 刪除預算
 */
export async function deleteBudget(
  accountId: number | string,
): Promise<{ account_id: number }> {
  if (!accountId) {
    throw new Error('缺少帳本 ID');
  }

  const db = await getDb();

  const query = `
    DELETE FROM budgets
    WHERE account_id = $1
    RETURNING account_id
  `;

  const result = await db.query(query, [Number(accountId)]);

  if (result.rowCount === 0) {
    throw new Error('找不到該預算');
  }

  return result.rows[0];
}
