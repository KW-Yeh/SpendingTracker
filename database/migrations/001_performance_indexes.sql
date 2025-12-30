-- Performance Optimization - Phase 2: Index Optimization
-- Created: 2025-12-26
-- Purpose: Add strategic indexes to improve query performance

-- =============================================================================
-- 1. 複合索引 - 加速帳本成員查詢
-- =============================================================================
-- Use case: 查詢使用者的所有帳本
-- Impact: GroupProvider.queryGroup()
CREATE INDEX IF NOT EXISTS idx_account_members_user_account
ON account_members(user_id, account_id);

COMMENT ON INDEX idx_account_members_user_account IS
'Accelerate user to accounts lookup. Used by GroupProvider when fetching user accounts.';


-- =============================================================================
-- 2. 複合索引 - 加速交易日期範圍查詢
-- =============================================================================
-- Use case: 查詢特定帳本在特定日期範圍的交易
-- Impact: getItems() API, Dashboard, Budget page
CREATE INDEX IF NOT EXISTS idx_transactions_account_date_type
ON transactions(account_id, date DESC, type)
INCLUDE (amount, category, description, necessity);

COMMENT ON INDEX idx_transactions_account_date_type IS
'Accelerate transaction queries by account and date range. Includes commonly needed columns.';


-- =============================================================================
-- 3. 部分索引 - 只索引支出交易
-- =============================================================================
-- Use case: 預算頁面只需要查詢支出類型的交易
-- Impact: Budget page spending calculations
CREATE INDEX IF NOT EXISTS idx_transactions_outcome_only
ON transactions(account_id, date DESC)
WHERE type = 'Outcome';

COMMENT ON INDEX idx_transactions_outcome_only IS
'Partial index for outcome transactions only. Used by budget page for spending calculations.';


-- =============================================================================
-- 4. 索引 - 加速預算查詢
-- =============================================================================
-- Use case: 查詢特定帳本的預算
-- Impact: BudgetProvider.syncBudget()
CREATE INDEX IF NOT EXISTS idx_budgets_account
ON budgets(account_id);

COMMENT ON INDEX idx_budgets_account IS
'Accelerate budget lookup by account_id. Used by BudgetProvider.';


-- =============================================================================
-- 5. 表達式索引 - 加速按年月查詢
-- =============================================================================
-- Use case: 統計每月支出、查詢特定月份的交易
-- Impact: Monthly statistics, MonthlyBudgetBlocks
CREATE INDEX IF NOT EXISTS idx_transactions_year_month
ON transactions(
  account_id,
  EXTRACT(YEAR FROM date)::INT,
  EXTRACT(MONTH FROM date)::INT
)
INCLUDE (amount, type);

COMMENT ON INDEX idx_transactions_year_month IS
'Expression index for year-month based queries. Used for monthly spending calculations.';


-- =============================================================================
-- 6. 索引 - 加速使用者查詢
-- =============================================================================
-- Use case: 透過 email 查詢使用者 (登入時)
-- Impact: JWT callback, UserConfigProvider
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

COMMENT ON INDEX idx_users_email IS
'Accelerate user lookup by email. Used during login and JWT token generation.';


-- =============================================================================
-- 驗證索引建立
-- =============================================================================
-- 查詢所有剛建立的索引
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE indexname IN (
  'idx_account_members_user_account',
  'idx_transactions_account_date_type',
  'idx_transactions_outcome_only',
  'idx_budgets_account',
  'idx_transactions_year_month',
  'idx_users_email'
)
ORDER BY tablename, indexname;


-- =============================================================================
-- 效能測試查詢
-- =============================================================================

-- Test 1: 使用者帳本查詢 (應該使用 idx_account_members_user_account)
-- EXPLAIN ANALYZE
-- SELECT gm.account_id, g.name
-- FROM account_members gm
-- JOIN accounts g ON gm.account_id = g.account_id
-- WHERE gm.user_id = 1;

-- Test 2: 日期範圍交易查詢 (應該使用 idx_transactions_account_date_type)
-- EXPLAIN ANALYZE
-- SELECT *
-- FROM transactions
-- WHERE account_id = 1
--   AND date >= '2025-01-01'
--   AND date <= '2025-12-31'
-- ORDER BY date DESC;

-- Test 3: 支出交易查詢 (應該使用 idx_transactions_outcome_only)
-- EXPLAIN ANALYZE
-- SELECT account_id, date, amount
-- FROM transactions
-- WHERE account_id = 1
--   AND type = 'Outcome'
-- ORDER BY date DESC;

-- Test 4: 年月統計查詢 (應該使用 idx_transactions_year_month)
-- EXPLAIN ANALYZE
-- SELECT
--   EXTRACT(YEAR FROM date)::INT as year,
--   EXTRACT(MONTH FROM date)::INT as month,
--   SUM(amount::NUMERIC) as total
-- FROM transactions
-- WHERE account_id = 1
-- GROUP BY year, month
-- ORDER BY year, month;


-- =============================================================================
-- 索引維護建議
-- =============================================================================

-- 查詢索引大小
-- SELECT
--   schemaname,
--   tablename,
--   indexname,
--   pg_size_pretty(pg_relation_size(indexrelid)) as index_size
-- FROM pg_stat_user_indexes
-- WHERE indexrelname LIKE 'idx_%'
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- 查詢索引使用統計
-- SELECT
--   schemaname,
--   tablename,
--   indexrelname,
--   idx_scan as index_scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE indexrelname LIKE 'idx_%'
-- ORDER BY idx_scan DESC;
