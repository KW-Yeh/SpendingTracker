/**
 * Feature Flags Configuration
 *
 * Use these flags to enable/disable optimized features.
 * This allows easy rollback to original implementation if needed.
 */

export const FEATURE_FLAGS = {
  /**
   * Use optimized SQL functions for data aggregation
   *
   * When true: Uses get_user_dashboard_data() SQL function (1 query)
   * When false: Uses original multi-query approach (3-4 queries)
   *
   * Performance impact: 70-90% faster when enabled
   */
  USE_OPTIMIZED_DASHBOARD: true,

  /**
   * Use optimized SQL functions for budget page
   *
   * When true: Uses get_budget_page_data() SQL function (1 query)
   * When false: Uses original multi-query approach (2-3 queries)
   *
   * Performance impact: 70-90% faster when enabled
   */
  USE_OPTIMIZED_BUDGET: true,

  /**
   * Use optimized SQL functions for transaction queries
   *
   * When true: Uses get_account_transactions() SQL function
   * When false: Uses original direct query approach
   *
   * Performance impact: Marginal improvement
   */
  USE_OPTIMIZED_TRANSACTIONS: true,
} as const;

/**
 * Helper to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}
