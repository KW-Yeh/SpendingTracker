/**
 * Color System
 *
 * 統一的顏色管理系統
 * 所有顏色都應該使用這裡定義的常數，而不是硬編碼
 *
 * 這些顏色對應 globals.css 中的 CSS 變數
 */

// ============================================================================
// Chart Colors - 圖表顏色
// ============================================================================

/**
 * 圖表顏色配置
 * 對應紫色系配色方案
 */
export const CHART_COLORS = {
  // 收入圖表（綠色系 - Mint）
  INCOME_PRIMARY: 'hsl(150, 40%, 55%)',      // --color-accent-mint-500
  INCOME_NECESSARY: 'hsl(150, 50%, 65%)',    // 必要收入（較淺）
  INCOME_UNNECESSARY: 'hsl(150, 30%, 75%)',  // 非必要收入（更淺）

  // 支出圖表（桃色系 - Peach）
  OUTCOME_PRIMARY: 'hsl(20, 80%, 70%)',      // --color-accent-peach-500
  OUTCOME_NECESSARY: 'hsl(20, 70%, 75%)',    // 必要支出（較淺）
  OUTCOME_UNNECESSARY: 'hsl(20, 60%, 85%)',  // 非必要支出（更淺）

  // 通用
  NEUTRAL: 'hsl(0, 0%, 80%)',                // --color-gray-200
} as const;

/**
 * 圖表顏色陣列（用於多系列圖表）
 * 按照推薦順序排列
 */
export const CHART_COLOR_PALETTE = [
  'hsl(270, 50%, 40%)',   // Primary purple
  'hsl(150, 40%, 55%)',   // Mint green
  'hsl(20, 80%, 70%)',    // Peach
  'hsl(300, 47%, 65%)',   // Orchid
  'hsl(250, 60%, 70%)',   // Lavender
  'hsl(270, 50%, 55%)',   // Lighter purple
  'hsl(150, 40%, 70%)',   // Lighter mint
  'hsl(20, 80%, 80%)',    // Lighter peach
] as const;

// ============================================================================
// UI Colors - 介面顏色
// ============================================================================

/**
 * 主要品牌色
 */
export const PRIMARY_COLORS = {
  50: 'hsl(270, 50%, 98%)',
  100: 'hsl(270, 50%, 95%)',
  200: 'hsl(270, 50%, 85%)',
  300: 'hsl(270, 50%, 70%)',
  400: 'hsl(270, 50%, 55%)',
  500: 'hsl(270, 50%, 40%)',  // #663399 主色
  600: 'hsl(270, 50%, 32%)',
  700: 'hsl(270, 50%, 24%)',
  800: 'hsl(270, 50%, 16%)',
  900: 'hsl(270, 50%, 10%)',
} as const;

/**
 * 輔助色 - Accent Colors
 */
export const ACCENT_COLORS = {
  lavender: {
    100: 'hsl(250, 60%, 95%)',
    500: 'hsl(250, 60%, 70%)',
  },
  orchid: {
    100: 'hsl(300, 47%, 95%)',
    500: 'hsl(300, 47%, 65%)',
  },
  mint: {
    100: 'hsl(150, 40%, 95%)',
    500: 'hsl(150, 40%, 55%)',
  },
  peach: {
    100: 'hsl(20, 80%, 95%)',
    500: 'hsl(20, 80%, 70%)',
  },
} as const;

/**
 * 語義化顏色
 */
export const SEMANTIC_COLORS = {
  // 成功（綠色）
  success: ACCENT_COLORS.mint[500],
  successLight: ACCENT_COLORS.mint[100],

  // 警告（桃色）
  warning: ACCENT_COLORS.peach[500],
  warningLight: ACCENT_COLORS.peach[100],

  // 資訊（紫色）
  info: PRIMARY_COLORS[500],
  infoLight: PRIMARY_COLORS[100],

  // 中性
  neutral: 'hsl(0, 0%, 80%)',
  neutralLight: 'hsl(0, 0%, 95%)',
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 從 CSS 變數名稱獲取顏色值
 * 用於需要在 runtime 取得 CSS 變數的場景
 */
export const getCSSVariable = (variableName: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: 返回預設值
    return PRIMARY_COLORS[500];
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

/**
 * 獲取圖表顏色（按索引）
 */
export const getChartColor = (index: number): string => {
  return CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length];
};

// ============================================================================
// Legacy Support - 向後相容
// ============================================================================

/**
 * @deprecated 使用 CHART_COLORS.INCOME_PRIMARY
 */
export const LEGACY_INCOME_COLOR = '#82ca9d';

/**
 * @deprecated 使用 CHART_COLORS.OUTCOME_PRIMARY
 */
export const LEGACY_OUTCOME_COLOR = '#faa5a5';

/**
 * @deprecated 使用 CHART_COLORS.NEUTRAL
 */
export const LEGACY_NEUTRAL_COLOR = '#d1d5db';

/**
 * @deprecated 使用 CHART_COLORS.INCOME_NECESSARY / OUTCOME_NECESSARY
 */
export const LEGACY_NECESSARY_COLOR = '#fdba74';
