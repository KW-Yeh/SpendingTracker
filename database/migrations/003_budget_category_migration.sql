-- ============================================================================
-- Migration 003: Add category field and rename name to description in budgets
-- ============================================================================
--
-- This migration updates the monthly_items JSON structure in the budgets table:
-- OLD: { "name": "房租", "description": "...", "months": {...} }
-- NEW: { "category": "🏠", "description": "房租", "months": {...} }
--
-- Steps:
-- 1. The monthly_items field stores a JSON array of budget items
-- 2. Each item needs a new "category" field (emoji matching transaction categories)
-- 3. The existing "name" field should be renamed to "description"
-- 4. The old "description" field (if any) should be dropped
--
-- IMPORTANT: This is a data migration. PostgreSQL doesn't support automatic
-- JSON transformation, so you need to manually update existing data or provide
-- a default category.
--
-- ============================================================================

-- OPTION 1: If you have no existing budget data, no migration needed
-- Just update your application code to use the new structure

-- OPTION 2: If you have existing data, you need to manually transform it
-- Example update query to add default category and rename name to description:

UPDATE budgets
SET monthly_items = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'category', '✨',  -- Default category (其他)
      'description', item->>'name',  -- Rename name to description
      'months', item->'months'
    )
  )
  FROM jsonb_array_elements(monthly_items::jsonb) AS item
)::text
WHERE monthly_items IS NOT NULL
  AND monthly_items != '[]';

-- OPTION 3: Manual update with specific categories
-- You can update each budget item individually with appropriate categories
-- Example:

-- UPDATE budgets
-- SET monthly_items = jsonb_set(
--   monthly_items::jsonb,
--   '{0,category}',
--   '"🏠"'::jsonb,
--   true
-- )::text
-- WHERE budget_id = YOUR_BUDGET_ID;

-- ============================================================================
-- Verification Query
-- ============================================================================
-- After migration, verify the structure:

-- SELECT
--   budget_id,
--   account_id,
--   jsonb_pretty(monthly_items::jsonb) as formatted_items
-- FROM budgets
-- WHERE monthly_items IS NOT NULL;

-- Expected output should show:
-- [
--   {
--     "category": "🏠",
--     "description": "房租",
--     "months": {
--       "1": 5000,
--       "2": 5000,
--       ...
--     }
--   }
-- ]

-- ============================================================================
-- Rollback
-- ============================================================================
-- To rollback (rename description back to name, remove category):

-- UPDATE budgets
-- SET monthly_items = (
--   SELECT jsonb_agg(
--     jsonb_build_object(
--       'name', item->>'description',
--       'months', item->'months'
--     )
--   )
--   FROM jsonb_array_elements(monthly_items::jsonb) AS item
-- )::text
-- WHERE monthly_items IS NOT NULL
--   AND monthly_items != '[]';
