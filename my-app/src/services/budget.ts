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

  const query = `
    INSERT INTO budgets (
      budget_id,
      account_id,
      annual_budget,
      monthly_budget,
      monthly_items,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    ON CONFLICT (account_id)
    DO UPDATE SET
      annual_budget = EXCLUDED.annual_budget,
      monthly_budget = EXCLUDED.monthly_budget,
      monthly_items = EXCLUDED.monthly_items,
      updated_at = NOW()
    RETURNING budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at
  `;

  const budgetId = budget_id || Date.now();
  const monthlyItemsJson = JSON.stringify(monthly_items);

  const result = await db.query(query, [
    budgetId,
    account_id,
    annual_budget,
    monthly_budget,
    monthlyItemsJson,
  ]);

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
