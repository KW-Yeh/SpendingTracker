import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/utils/getAurora';

/**
 * GET /api/aurora/sync?user_id=X&since=ISO_TIMESTAMP
 * Pull endpoint: returns all data updated since the given timestamp
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const since = searchParams.get('since') || '1970-01-01T00:00:00.000Z';

    if (!userId) {
      return NextResponse.json(
        { error: '缺少 user_id 參數' },
        { status: 400 },
      );
    }

    const db = await getDb();

    // 1. Fetch user data
    const userResult = await db.query(
      `SELECT user_id, email, name, avatar_url, created_at, updated_at
       FROM users WHERE user_id = $1`,
      [userId],
    );
    const user: User | null = userResult.rows[0] || null;

    // 2. Fetch all groups the user belongs to
    const groupsResult = await db.query(
      `SELECT
        a.account_id, a.name, a.owner_id,
        a.created_at, a.updated_at,
        u.email as owner_email, u.name as owner_name,
        am.role as user_role,
        COUNT(DISTINCT am2.user_id) as member_count
       FROM account_members am
       JOIN accounts a ON am.account_id = a.account_id
       JOIN users u ON a.owner_id = u.user_id
       LEFT JOIN account_members am2 ON a.account_id = am2.account_id
       WHERE am.user_id = $1
       GROUP BY a.account_id, a.name, a.owner_id,
                a.created_at, a.updated_at, u.email, u.name, am.role
       ORDER BY a.created_at DESC`,
      [userId],
    );
    const groups: Group[] = groupsResult.rows;

    const groupIds = groups.map((g) => g.account_id).filter(Boolean);

    // 3. Fetch members for all groups
    const members: Record<number, GroupMember[]> = {};
    if (groupIds.length > 0) {
      const membersResult = await db.query(
        `SELECT
          am.account_id, am.user_id, am.role, am.joined_at, am.updated_at,
          u.email, u.name
         FROM account_members am
         JOIN users u ON am.user_id = u.user_id
         WHERE am.account_id = ANY($1)
         ORDER BY am.account_id, am.joined_at ASC`,
        [groupIds],
      );
      for (const row of membersResult.rows) {
        if (!members[row.account_id]) {
          members[row.account_id] = [];
        }
        members[row.account_id].push(row);
      }
    }

    // 4. Fetch transactions for all groups (recent 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    threeMonthsAgo.setDate(1);
    threeMonthsAgo.setHours(0, 0, 0, 0);

    const transactions: Record<string, SpendingRecord[]> = {};
    if (groupIds.length > 0) {
      const txResult = await db.query(
        `SELECT
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
         WHERE t.account_id = ANY($1)
           AND t."date" >= $2
         ORDER BY t."date" DESC`,
        [groupIds, threeMonthsAgo.toISOString()],
      );

      for (const row of txResult.rows) {
        const date = new Date(row.date);
        const key = `${row.groupId}_${date.getFullYear()}_${date.getMonth()}`;
        if (!transactions[key]) {
          transactions[key] = [];
        }
        transactions[key].push(row);
      }
    }

    // 5. Fetch budgets for all groups
    const budgets: Budget[] = [];
    if (groupIds.length > 0) {
      const budgetsResult = await db.query(
        `SELECT budget_id, account_id, annual_budget, monthly_budget,
                monthly_items, created_at, updated_at
         FROM budgets
         WHERE account_id = ANY($1)`,
        [groupIds],
      );
      for (const row of budgetsResult.rows) {
        budgets.push({
          ...row,
          monthly_items:
            typeof row.monthly_items === 'string'
              ? JSON.parse(row.monthly_items)
              : row.monthly_items || [],
        });
      }
    }

    // 6. Fetch favorite categories
    const favResult = await db.query(
      `SELECT category_id, owner_id, food, clothing, housing, transportation,
              education, entertainment, daily, medical, investment, other,
              salary, bonus, created_at, updated_at
       FROM favorite_categories
       WHERE owner_id = $1`,
      [userId],
    );
    const favorites: FavoriteCategories | null = favResult.rows[0] || null;

    const response: SyncPullResponse = {
      user,
      groups,
      members,
      transactions,
      budgets,
      favorites,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Sync Pull] Error:', error);
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json(
      { error: '同步拉取失敗', detail: message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/aurora/sync
 * Push endpoint: receives local data and upserts where client is newer
 */
export async function POST(req: NextRequest) {
  try {
    const body: SyncPushPayload = await req.json();
    const { user, transactions, budgets, favorites } = body;

    if (!user?.user_id) {
      return NextResponse.json(
        { error: '缺少使用者資料' },
        { status: 400 },
      );
    }

    const db = await getDb();
    const results = {
      user: { updated: false },
      transactions: { upserted: 0, skipped: 0 },
      budgets: { upserted: 0, skipped: 0 },
      favorites: { updated: false },
    };

    // 1. Push user data (upsert with conflict resolution)
    if (user.updated_at) {
      await db.query(
        `UPDATE users SET name = $1, avatar_url = $2, updated_at = $3
         WHERE user_id = $4
           AND (updated_at IS NULL OR $3::timestamp > updated_at)`,
        [user.name, user.avatar_url || null, user.updated_at, user.user_id],
      );
      results.user.updated = true;
    }

    // 2. Push transactions - batch email lookup, then parallel upserts
    const validTx = transactions.filter((tx) => tx.id);
    if (validTx.length > 0) {
      // Batch lookup: collect unique emails and resolve to user_ids
      const uniqueEmails = [
        ...new Set(validTx.map((tx) => tx['user-token']).filter(Boolean)),
      ];
      const emailToUserId: Record<string, string> = {};
      if (uniqueEmails.length > 0) {
        const emailResult = await db.query(
          `SELECT user_id, email FROM users WHERE email = ANY($1)`,
          [uniqueEmails],
        );
        for (const row of emailResult.rows) {
          emailToUserId[row.email] = row.user_id;
        }
      }

      // Parallel upserts (batches of 10 to avoid overwhelming the DB)
      const BATCH_SIZE = 10;
      for (let i = 0; i < validTx.length; i += BATCH_SIZE) {
        const batch = validTx.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map((tx) => {
            const recordedByUserId =
              (tx['user-token'] && emailToUserId[tx['user-token']]) ||
              user.user_id;
            return db.query(
              `INSERT INTO transactions (
                transaction_id, account_id, recorded_by_user_id,
                necessity, "date", category, amount, description, type, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
              ON CONFLICT (transaction_id)
              DO UPDATE SET
                necessity = EXCLUDED.necessity,
                "date" = EXCLUDED."date",
                category = EXCLUDED.category,
                amount = EXCLUDED.amount,
                description = EXCLUDED.description,
                type = EXCLUDED.type,
                updated_at = EXCLUDED.updated_at
              WHERE transactions.updated_at IS NULL
                 OR EXCLUDED.updated_at > transactions.updated_at`,
              [
                tx.id,
                tx.groupId || 1,
                recordedByUserId,
                tx.necessity,
                tx.date,
                tx.category,
                tx.amount,
                tx.description,
                tx.type,
                tx.updated_at || new Date().toISOString(),
              ],
            );
          }),
        );
      }
      results.transactions.upserted = validTx.length;
    }

    // 3. Push budgets (direct upsert, no pre-check needed)
    for (const budget of budgets) {
      if (!budget.account_id) continue;
      const monthlyItemsJson = JSON.stringify(budget.monthly_items);
      await db.query(
        `INSERT INTO budgets (
          budget_id, account_id, annual_budget, monthly_budget,
          monthly_items, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), $6)
        ON CONFLICT (account_id)
        DO UPDATE SET
          annual_budget = EXCLUDED.annual_budget,
          monthly_budget = EXCLUDED.monthly_budget,
          monthly_items = EXCLUDED.monthly_items,
          updated_at = EXCLUDED.updated_at
        WHERE budgets.updated_at IS NULL
           OR EXCLUDED.updated_at > budgets.updated_at`,
        [
          budget.budget_id || Date.now(),
          budget.account_id,
          budget.annual_budget,
          budget.monthly_budget,
          monthlyItemsJson,
          budget.updated_at || new Date().toISOString(),
        ],
      );
      results.budgets.upserted++;
    }

    // 4. Push favorite categories (direct upsert, no pre-check needed)
    if (favorites && favorites.owner_id) {
      await db.query(
        `INSERT INTO favorite_categories (
          category_id, owner_id, food, clothing, housing, transportation,
          education, entertainment, daily, medical, investment, other,
          salary, bonus, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), $15)
        ON CONFLICT (owner_id)
        DO UPDATE SET
          food = EXCLUDED.food, clothing = EXCLUDED.clothing,
          housing = EXCLUDED.housing, transportation = EXCLUDED.transportation,
          education = EXCLUDED.education, entertainment = EXCLUDED.entertainment,
          daily = EXCLUDED.daily, medical = EXCLUDED.medical,
          investment = EXCLUDED.investment, other = EXCLUDED.other,
          salary = EXCLUDED.salary, bonus = EXCLUDED.bonus,
          updated_at = EXCLUDED.updated_at
        WHERE favorite_categories.updated_at IS NULL
           OR EXCLUDED.updated_at > favorite_categories.updated_at`,
        [
          favorites.category_id || Date.now(),
          favorites.owner_id,
          favorites.food || '',
          favorites.clothing || '',
          favorites.housing || '',
          favorites.transportation || '',
          favorites.education || '',
          favorites.entertainment || '',
          favorites.daily || '',
          favorites.medical || '',
          favorites.investment || '',
          favorites.other || '',
          favorites.salary || '',
          favorites.bonus || '',
          favorites.updated_at || new Date().toISOString(),
        ],
      );
      results.favorites.updated = true;
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('[Sync Push] Error:', error);
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json(
      { error: '同步推送失敗', detail: message },
      { status: 500 },
    );
  }
}
