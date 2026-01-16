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
 * 對應暖色系配色方案（橙色、紅色、金色為主）
 */
export const CHART_COLORS = {
  // 收入圖表（綠色系）
  INCOME_PRIMARY: '#22C55E',      // --color-income-500
  INCOME_NECESSARY: '#4ADE80',    // --color-income-400 必要收入（較淺）
  INCOME_UNNECESSARY: '#86EFAC',  // --color-income-300 非必要收入（更淺）

  // 支出圖表（暖紅色系）
  OUTCOME_PRIMARY: '#EF4444',     // --color-secondary-500
  OUTCOME_NECESSARY: '#F87171',   // --color-secondary-400 必要支出（較淺）
  OUTCOME_UNNECESSARY: '#FCA5A5', // --color-secondary-300 非必要支出（更淺）

  // 通用
  NEUTRAL: '#D6D3D1',             // --color-gray-300
} as const;

/**
 * 圖表顏色陣列（用於多系列圖表）
 * 按照推薦順序排列 - 暖色系
 */
export const CHART_COLOR_PALETTE = [
  '#F97316',   // Primary orange (主橙色)
  '#EF4444',   // Secondary red (紅色)
  '#F59E0B',   // Accent gold (金色)
  '#EC4899',   // Pink (粉紅)
  '#A855F7',   // Purple (紫)
  '#3B82F6',   // Blue (藍)
  '#22C55E',   // Green (綠)
  '#14B8A6',   // Teal (青)
] as const;

// ============================================================================
// UI Colors - 介面顏色
// ============================================================================

/**
 * 主要品牌色（暖橙色）
 */
export const PRIMARY_COLORS = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',  // 主橙色
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
} as const;

/**
 * 輔助色 - Accent Colors（暖色系）
 */
export const ACCENT_COLORS = {
  // 金黃色
  gold: {
    100: '#FEF3C7',
    500: '#F59E0B',
  },
  // 暖紅色
  red: {
    100: '#FEE2E2',
    500: '#EF4444',
  },
  // 收入綠色
  green: {
    100: '#DCFCE7',
    500: '#22C55E',
  },
  // 粉紅色（圖表用）
  pink: {
    100: '#FCE7F3',
    500: '#EC4899',
  },
} as const;

/**
 * 灰階顏色
 */
export const GRAY_COLORS = {
  100: 'hsl(0, 0%, 95%)',
  200: 'hsl(0, 0%, 80%)',
  300: 'hsl(0, 0%, 70%)',
  400: 'hsl(0, 0%, 60%)',
  500: 'hsl(0, 0%, 50%)',
  600: 'hsl(0, 0%, 40%)',
  700: 'hsl(0, 0%, 30%)',
  800: 'hsl(0, 0%, 20%)',
  900: 'hsl(0, 0%, 10%)',
} as const;

/**
 * 語義化顏色
 */
export const SEMANTIC_COLORS = {
  // 成功（綠色）
  success: ACCENT_COLORS.green[500],
  successLight: ACCENT_COLORS.green[100],

  // 警告（金黃色）
  warning: ACCENT_COLORS.gold[500],
  warningLight: ACCENT_COLORS.gold[100],

  // 錯誤（紅色）
  error: ACCENT_COLORS.red[500],
  errorLight: ACCENT_COLORS.red[100],

  // 資訊（橙色）
  info: PRIMARY_COLORS[500],
  infoLight: PRIMARY_COLORS[100],

  // 中性
  neutral: GRAY_COLORS[200],
  neutralLight: GRAY_COLORS[100],
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
