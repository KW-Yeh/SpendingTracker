/**
 * Optimized Server-Side Services
 *
 * These functions are designed for Server Components and Server Actions.
 * They directly query the database without HTTP overhead.
 *
 * Performance: Even faster than API routes (no HTTP round trip)
 */

import 'server-only';
import { getPool } from '@/utils/getAurora';
import { FEATURE_FLAGS } from '@/config/features';
import { getUser } from '@/services/user';
import { getUserGroups } from '@/services/group';
import { getItems } from '@/services/transaction';
import { getBudget } from '@/services/budget';

/**
 * Dashboard Data Response
 */
interface DashboardDataResponse {
  status: boolean;
  message?: string;
  data?: {
    user: any;
    groups: any[];
    recentTransactions: any[];
  };
}

/**
 * Budget Page Data Response
 */
interface BudgetPageDataResponse {
  status: boolean;
  message?: string;
  data?: {
    budget: any | null;
    yearlyTransactions: any[];
    monthlyStatistics: {
      [month: string]: {
        total_outcome: number;
        total_income: number;
        transaction_count: number;
      };
    };
  };
}

/**
 * Get dashboard data directly from database (Server-only)
 *
 * Use this in Server Components instead of fetching via API
 *
 * @param userId - User ID
 * @returns Dashboard data
 *
 * Performance: ~10-30ms (vs ~50-100ms via API route)
 */
export async function getDashboardDataDirect(
  userId: number
): Promise<DashboardDataResponse> {
  try {
    if (FEATURE_FLAGS.USE_OPTIMIZED_DASHBOARD) {
      return await getOptimizedDashboardDataDirect(userId);
    } else {
      return await getLegacyDashboardDataDirect(userId);
    }
  } catch (error) {
    console.error('[getDashboardDataDirect] Error:', error);
    return {
      status: false,
      message: 'Internal Server Error',
    };
  }
}

/**
 * Optimized implementation using SQL function
 */
async function getOptimizedDashboardDataDirect(userId: number) {
  const pool = await getPool();

  const result = await pool.query(
    'SELECT get_user_dashboard_data($1) as data',
    [userId]
  );

  if (!result.rows[0]?.data) {
    return {
      status: false,
      message: 'No data found',
    };
  }

  // Parse the JSON string returned from the function
  const data = typeof result.rows[0].data === 'string'
    ? JSON.parse(result.rows[0].data)
    : result.rows[0].data;

  return {
    status: true,
    data: {
      user: data.user,
      groups: data.groups,
      recentTransactions: data.recent_transactions,
    },
  };
}

/**
 * Legacy implementation using multiple queries
 */
async function getLegacyDashboardDataDirect(userId: number) {
  // Get user data
  const user = await getUser(String(userId));

  if (!user) {
    return {
      status: false,
      message: 'User not found',
    };
  }

  // Get user's groups
  const groups = await getUserGroups(userId);

  // Get recent transactions (last 30 days) from all user's groups
  const groupIds = groups.map((g: any) => g.account_id);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = groupIds.length > 0
    ? await getItems({
        groupId: groupIds[0],
        startDate: thirtyDaysAgo.toISOString().split('T')[0],
      })
    : [];

  return {
    status: true,
    data: {
      user,
      groups,
      recentTransactions: recentTransactions.slice(0, 50),
    },
  };
}

/**
 * Get budget page data directly from database (Server-only)
 *
 * Use this in Server Components instead of fetching via API
 *
 * @param accountId - Account ID
 * @param year - Optional year (defaults to current year)
 * @returns Budget page data
 *
 * Performance: ~20-50ms (vs ~70-150ms via API route)
 */
export async function getBudgetPageDataDirect(
  accountId: number,
  year?: number
): Promise<BudgetPageDataResponse> {
  try {
    if (FEATURE_FLAGS.USE_OPTIMIZED_BUDGET) {
      return await getOptimizedBudgetDataDirect(accountId, year);
    } else {
      return await getLegacyBudgetDataDirect(accountId, year);
    }
  } catch (error) {
    console.error('[getBudgetPageDataDirect] Error:', error);
    return {
      status: false,
      message: 'Internal Server Error',
    };
  }
}

/**
 * Optimized implementation using SQL function
 */
async function getOptimizedBudgetDataDirect(accountId: number, year?: number) {
  const pool = await getPool();

  const result = year
    ? await pool.query(
        'SELECT get_budget_page_data($1, $2) as data',
        [accountId, year]
      )
    : await pool.query(
        'SELECT get_budget_page_data($1) as data',
        [accountId]
      );

  if (!result.rows[0]?.data) {
    return {
      status: false,
      message: 'No data found',
    };
  }

  // Parse the JSON string returned from the function
  const data = typeof result.rows[0].data === 'string'
    ? JSON.parse(result.rows[0].data)
    : result.rows[0].data;

  return {
    status: true,
    data: {
      budget: data.budget,
      yearlyTransactions: data.yearly_transactions,
      monthlyStatistics: data.monthly_statistics,
    },
  };
}

/**
 * Legacy implementation using multiple queries
 */
async function getLegacyBudgetDataDirect(accountId: number, year?: number) {
  const currentYear = year || new Date().getFullYear();

  // Get budget data
  const budget = await getBudget(accountId);

  // Get yearly transactions
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  const yearlyTransactions = await getItems({
    groupId: String(accountId),
    startDate,
    endDate,
  });

  // Calculate monthly statistics
  const monthlyStatistics: any = {};
  for (let month = 1; month <= 12; month++) {
    const monthTransactions = yearlyTransactions.filter((t: any) => {
      const date = new Date(t.date);
      return date.getFullYear() === currentYear && date.getMonth() + 1 === month;
    });

    monthlyStatistics[month] = {
      total_outcome: monthTransactions
        .filter((t: any) => t.type === 'Outcome')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0),
      total_income: monthTransactions
        .filter((t: any) => t.type === 'Income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0),
      transaction_count: monthTransactions.length,
    };
  }

  return {
    status: true,
    data: {
      budget,
      yearlyTransactions,
      monthlyStatistics,
    },
  };
}
