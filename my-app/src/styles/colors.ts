/**
 * Color System - Solo Leveling Dark Theme
 *
 * 統一的顏色管理系統
 * 所有顏色都應該使用這裡定義的常數，而不是硬編碼
 *
 * 這些顏色對應 globals.css 中的 CSS 變數
 * 配色靈感：獨自升級（Solo Leveling）- 冷色系深色主題
 */

// ============================================================================
// Chart Colors - 圖表顏色
// ============================================================================

/**
 * 圖表顏色配置
 * 對應冷色系配色方案（青藍色、紫色、藍色為主）
 */
export const CHART_COLORS = {
  // 收入圖表（翡翠綠系）
  INCOME_PRIMARY: '#10B981',      // --color-income-500
  INCOME_NECESSARY: '#34D399',    // --color-income-400 必要收入（較亮）
  INCOME_UNNECESSARY: '#6EE7B7',  // --color-income-300 非必要收入（更亮）

  // 支出圖表（紫色系）
  OUTCOME_PRIMARY: '#A855F7',     // --color-secondary-500
  OUTCOME_NECESSARY: '#C084FC',   // --color-secondary-400 必要支出（較亮）
  OUTCOME_UNNECESSARY: '#D8B4FE', // --color-secondary-300 非必要支出（更亮）

  // 通用
  NEUTRAL: '#475569',             // --color-gray-600
} as const;

/**
 * 圖表顏色陣列（用於多系列圖表）
 * 按照推薦順序排列 - 冷色系 Solo Leveling 風格
 */
export const CHART_COLOR_PALETTE = [
  '#06B6D4',   // Primary cyan (主青色)
  '#A855F7',   // Secondary purple (紫色)
  '#3B82F6',   // Accent blue (藍色)
  '#22D3EE',   // Light cyan (淺青)
  '#C084FC',   // Light purple (淺紫)
  '#10B981',   // Emerald (翡翠綠)
  '#60A5FA',   // Light blue (淺藍)
  '#F472B6',   // Pink (粉紅)
] as const;

// ============================================================================
// UI Colors - 介面顏色
// ============================================================================

/**
 * 主要品牌色（青藍色）
 */
export const PRIMARY_COLORS = {
  50: '#ECFEFF',
  100: '#CFFAFE',
  200: '#A5F3FC',
  300: '#67E8F9',
  400: '#22D3EE',
  500: '#06B6D4',  // 主青色
  600: '#0891B2',
  700: '#0E7490',
  800: '#155E75',
  900: '#164E63',
} as const;

/**
 * 輔助色 - Accent Colors（冷色系）
 */
export const ACCENT_COLORS = {
  // 紫色（神秘魔力感）
  purple: {
    100: '#F3E8FF',
    500: '#A855F7',
  },
  // 電光藍
  blue: {
    100: '#DBEAFE',
    500: '#3B82F6',
  },
  // 翡翠綠（收入）
  green: {
    100: '#D1FAE5',
    500: '#10B981',
  },
  // 粉紅色（圖表用）
  pink: {
    100: '#FCE7F3',
    500: '#EC4899',
  },
} as const;

/**
 * 灰階顏色（Slate 冷灰調）
 */
export const GRAY_COLORS = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
} as const;

/**
 * 語義化顏色
 */
export const SEMANTIC_COLORS = {
  // 成功（翡翠綠）
  success: ACCENT_COLORS.green[500],
  successLight: ACCENT_COLORS.green[100],

  // 警告（金黃色）
  warning: '#FBBF24',
  warningLight: '#FEF3C7',

  // 錯誤（珊瑚紅）
  error: '#F87171',
  errorLight: '#FEE2E2',

  // 資訊（青藍色）
  info: PRIMARY_COLORS[500],
  infoLight: PRIMARY_COLORS[100],

  // 中性
  neutral: GRAY_COLORS[600],
  neutralLight: GRAY_COLORS[700],
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
export const LEGACY_INCOME_COLOR = '#10B981';

/**
 * @deprecated 使用 CHART_COLORS.OUTCOME_PRIMARY
 */
export const LEGACY_OUTCOME_COLOR = '#A855F7';

/**
 * @deprecated 使用 CHART_COLORS.NEUTRAL
 */
export const LEGACY_NEUTRAL_COLOR = '#475569';

/**
 * @deprecated 使用 CHART_COLORS.INCOME_NECESSARY / OUTCOME_NECESSARY
 */
export const LEGACY_NECESSARY_COLOR = '#22D3EE';
