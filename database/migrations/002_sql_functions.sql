-- Performance Optimization - Phase 3: SQL Functions
-- Created: 2025-12-26
-- Purpose: Aggregate data retrieval functions to reduce API round trips

-- =============================================================================
-- Function 1: get_user_dashboard_data
-- =============================================================================
-- Purpose: Single query to get all dashboard data for a user
-- Replaces: 3-4 separate API calls (user → groups → transactions)
-- Input: user_id (from JWT token)
-- Output: JSON with groups and recent transactions

CREATE OR REPLACE FUNCTION get_user_dashboard_data(p_user_id INT)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user', (
      SELECT json_build_object(
        'user_id', u.user_id,
        'name', u.name,
        'email', u.email,
        'avatar', u.avatar,
        'default_group', u.default_group
      )
      FROM users u
      WHERE u.user_id = p_user_id
    ),
    'groups', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'account_id', g.account_id,
          'name', g.name,
          'icon', g.icon,
          'currency', g.currency,
          'created_at', g.created_at,
          'is_owner', (gm.user_id = g.owner_id)
        )
        ORDER BY g.created_at DESC
      ), '[]'::json)
      FROM group_members gm
      JOIN groups g ON gm.account_id = g.account_id
      WHERE gm.user_id = p_user_id
    ),
    'recent_transactions', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'spending_id', s.spending_id,
          'account_id', s.account_id,
          'user_id', s.user_id,
          'amount', s.amount,
          'type', s.type,
          'category', s.category,
          'description', s.description,
          'date', s.date,
          'necessity', s.necessity,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        )
        ORDER BY s.date DESC, s.created_at DESC
      ), '[]'::json)
      FROM spendings s
      WHERE s.account_id IN (
        SELECT gm.account_id
        FROM group_members gm
        WHERE gm.user_id = p_user_id
      )
      AND s.date >= CURRENT_DATE - INTERVAL '30 days'
      LIMIT 50
    )
  ) INTO result;

  RETURN result;
END;
$$;

COMMENT ON FUNCTION get_user_dashboard_data(INT) IS
'Returns all dashboard data (user, groups, recent transactions) in a single query. Used by dashboard page.';


-- =============================================================================
-- Function 2: get_budget_page_data
-- =============================================================================
-- Purpose: Single query to get all budget page data
-- Replaces: 2-3 separate API calls (budget → transactions for year)
-- Input: account_id, year (optional, defaults to current year)
-- Output: JSON with budget and yearly transactions

CREATE OR REPLACE FUNCTION get_budget_page_data(
  p_account_id INT,
  p_year INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INT
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSON;
  year_start DATE;
  year_end DATE;
BEGIN
  -- Calculate year boundaries
  year_start := make_date(p_year, 1, 1);
  year_end := make_date(p_year, 12, 31);

  SELECT json_build_object(
    'budget', (
      SELECT json_build_object(
        'budget_id', b.budget_id,
        'account_id', b.account_id,
        'annual_budget', b.annual_budget,
        'monthly_items', b.monthly_items,
        'created_at', b.created_at,
        'updated_at', b.updated_at
      )
      FROM budgets b
      WHERE b.account_id = p_account_id
      LIMIT 1
    ),
    'yearly_transactions', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'spending_id', s.spending_id,
          'account_id', s.account_id,
          'user_id', s.user_id,
          'amount', s.amount,
          'type', s.type,
          'category', s.category,
          'description', s.description,
          'date', s.date,
          'necessity', s.necessity,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        )
        ORDER BY s.date DESC
      ), '[]'::json)
      FROM spendings s
      WHERE s.account_id = p_account_id
        AND s.date >= year_start
        AND s.date <= year_end
    ),
    'monthly_statistics', (
      SELECT json_object_agg(
        month_num::TEXT,
        json_build_object(
          'total_outcome', COALESCE(SUM(s.amount::NUMERIC) FILTER (WHERE s.type = 'Outcome'), 0),
          'total_income', COALESCE(SUM(s.amount::NUMERIC) FILTER (WHERE s.type = 'Income'), 0),
          'transaction_count', COUNT(s.spending_id)
        )
      )
      FROM generate_series(1, 12) AS month_num
      LEFT JOIN spendings s ON
        s.account_id = p_account_id
        AND EXTRACT(YEAR FROM s.date)::INT = p_year
        AND EXTRACT(MONTH FROM s.date)::INT = month_num
      GROUP BY month_num
    )
  ) INTO result;

  RETURN result;
END;
$$;

COMMENT ON FUNCTION get_budget_page_data(INT, INT) IS
'Returns all budget page data (budget, yearly transactions, monthly statistics) in a single query. Used by budget page.';


-- =============================================================================
-- Function 3: get_account_transactions
-- =============================================================================
-- Purpose: Optimized transaction retrieval with date range
-- Replaces: Direct spendings queries with better performance
-- Input: account_id, start_date, end_date (optional)
-- Output: JSON array of transactions

CREATE OR REPLACE FUNCTION get_account_transactions(
  p_account_id INT,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT COALESCE(json_agg(
    json_build_object(
      'spending_id', s.spending_id,
      'account_id', s.account_id,
      'user_id', s.user_id,
      'amount', s.amount,
      'type', s.type,
      'category', s.category,
      'description', s.description,
      'date', s.date,
      'necessity', s.necessity,
      'created_at', s.created_at,
      'updated_at', s.updated_at
    )
    ORDER BY s.date DESC, s.created_at DESC
  ), '[]'::json)
  INTO result
  FROM spendings s
  WHERE s.account_id = p_account_id
    AND (p_start_date IS NULL OR s.date >= p_start_date)
    AND (p_end_date IS NULL OR s.date <= p_end_date);

  RETURN result;
END;
$$;

COMMENT ON FUNCTION get_account_transactions(INT, DATE, DATE) IS
'Returns transactions for an account within optional date range. Optimized with indexes.';


-- =============================================================================
-- Function 4: get_user_groups_with_permissions
-- =============================================================================
-- Purpose: Get all groups for a user with permission information
-- Replaces: groups + group_members join queries
-- Input: user_id
-- Output: JSON array of groups with permission flags

CREATE OR REPLACE FUNCTION get_user_groups_with_permissions(p_user_id INT)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT COALESCE(json_agg(
    json_build_object(
      'account_id', g.account_id,
      'name', g.name,
      'icon', g.icon,
      'currency', g.currency,
      'owner_id', g.owner_id,
      'is_owner', (g.owner_id = p_user_id),
      'member_count', (
        SELECT COUNT(*)
        FROM group_members gm2
        WHERE gm2.account_id = g.account_id
      ),
      'created_at', g.created_at
    )
    ORDER BY g.created_at DESC
  ), '[]'::json)
  INTO result
  FROM group_members gm
  JOIN groups g ON gm.account_id = g.account_id
  WHERE gm.user_id = p_user_id;

  RETURN result;
END;
$$;

COMMENT ON FUNCTION get_user_groups_with_permissions(INT) IS
'Returns all groups for a user with ownership and permission information.';


-- =============================================================================
-- Verification Queries
-- =============================================================================

-- List all created functions
SELECT
  proname as function_name,
  pg_get_function_arguments(oid) as arguments,
  obj_description(oid, 'pg_proc') as description
FROM pg_proc
WHERE proname IN (
  'get_user_dashboard_data',
  'get_budget_page_data',
  'get_account_transactions',
  'get_user_groups_with_permissions'
)
ORDER BY proname;


-- =============================================================================
-- Performance Test Queries
-- =============================================================================

-- Test 1: Dashboard data (replace user_id with actual value)
-- SELECT get_user_dashboard_data(1);

-- Test 2: Budget page data (replace account_id with actual value)
-- SELECT get_budget_page_data(1, 2025);

-- Test 3: Account transactions
-- SELECT get_account_transactions(1, '2025-01-01', '2025-12-31');

-- Test 4: User groups with permissions
-- SELECT get_user_groups_with_permissions(1);


-- =============================================================================
-- Rollback (if needed)
-- =============================================================================

-- DROP FUNCTION IF EXISTS get_user_dashboard_data(INT);
-- DROP FUNCTION IF EXISTS get_budget_page_data(INT, INT);
-- DROP FUNCTION IF EXISTS get_account_transactions(INT, DATE, DATE);
-- DROP FUNCTION IF EXISTS get_user_groups_with_permissions(INT);
