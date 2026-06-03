/**
 * Color System - Apple-style Light Theme（依 DESIGN.md）
 *
 * 統一的顏色管理系統
 * 所有顏色都應該使用這裡定義的常數，而不是硬編碼
 *
 * 這些顏色對應 globals.css 中的 CSS 變數
 * 設計原則：白/羊皮紙淺色畫布、近黑 ink 文字、單一 Action Blue (#0066CC) 互動色
 */

// ============================================================================
// Chart Colors - 圖表顏色
// ============================================================================

/**
 * 圖表顏色配置
 * 淺色底圖表用中等飽和度色彩，維持紅支出 / 綠收入的金融慣例
 */
export const CHART_COLORS = {
  // 收入圖表（綠系）
  INCOME_PRIMARY: '#248A3D', // --color-income-500
  INCOME_NECESSARY: '#2DA44E', // --color-income-400 必要收入（較亮）
  INCOME_UNNECESSARY: '#7DD89E', // --color-income-300 非必要收入（更亮）

  // 支出圖表（紅系 - 符合金融慣例）
  OUTCOME_PRIMARY: '#E30000', // 支出主色
  OUTCOME_NECESSARY: '#FF6961', // 必要支出（較亮）
  OUTCOME_UNNECESSARY: '#FFB3AE', // 非必要支出（更亮）

  // 通用
  NEUTRAL: '#86868B', // --color-gray-500
} as const;

/**
 * 圖表顏色陣列（用於多系列圖表）
 * 以 Action Blue 為首的低調系統色盤，適合白底
 */
export const CHART_COLOR_PALETTE = [
  '#0066CC', // Action Blue（主互動色）
  '#248A3D', // Green（收入綠）
  '#B25000', // Orange（暖色對比）
  '#0071E3', // Focus Blue
  '#6BA6E0', // Light blue
  '#2DA44E', // Light green
  '#86868B', // Neutral gray
  '#E30000', // Red（支出紅）
] as const;

// ============================================================================
// UI Colors - 介面顏色
// ============================================================================

/**
 * 主要品牌色（Action Blue — 全站唯一互動色）
 */
export const PRIMARY_COLORS = {
  50: '#F2F7FC',
  100: '#D9E8F7',
  200: '#B3D1EF',
  300: '#6BA6E0',
  400: '#0071E3', // Focus Blue
  500: '#0066CC', // Action Blue
  600: '#0055AB',
  700: '#00468C',
  800: '#00386F',
  900: '#002B55',
} as const;

/**
 * 輔助色 - Accent Colors（無第二品牌色，僅保留功能性色彩）
 */
export const ACCENT_COLORS = {
  // 藍色（= Action Blue，向後相容別名）
  purple: {
    100: '#D9E8F7',
    500: '#0066CC',
  },
  // 藍色
  blue: {
    100: '#D9E8F7',
    500: '#0066CC',
  },
  // 綠色（收入）
  green: {
    100: '#D8F3E0',
    500: '#248A3D',
  },
  // 紅色（圖表用，支出語意）
  pink: {
    100: '#FFD9D6',
    500: '#E30000',
  },
} as const;

/**
 * 灰階顏色（Apple 中性灰 — 近黑 ink 到純白 canvas）
 */
export const GRAY_COLORS = {
  50: '#FFFFFF',
  100: '#FAFAFC',
  200: '#F5F5F7',
  300: '#E8E8ED',
  400: '#D2D2D7',
  500: '#A1A1A6',
  600: '#86868B',
  700: '#7A7A7A',
  800: '#494949',
  900: '#333333',
  950: '#1D1D1F',
} as const;

/**
 * 金錢語意顏色（符合金融慣例：紅 = 支出 / 綠 = 收入）
 *
 * 使用準則：
 * - `expense` 給支出金額、支出 badge、支出方向 delta
 * - `overBudget` 比 `expense` 更鮮，**只**給超支警示（border / 警告 row）
 * - `warning` 給預算 80–99% 的橘色警示
 * - `primary` 給「中性的現況數字」（例：本月結餘為正時、進度條 < 80%）
 * - `primaryGlow` 是 RGB 字串，用於 `rgba(var(--...), .X)` 樣式
 */
export const MONEY_COLORS = {
  income: '#248A3D', // green — 白底可讀
  incomeMuted: 'rgba(36, 138, 61, 0.10)',
  expense: '#E30000', // red
  expenseMuted: 'rgba(227, 0, 0, 0.08)',
  overBudget: '#D70015', // 比 expense 更深的警示紅
  warning: '#B25000', // 白底可讀的橘
  primary: PRIMARY_COLORS[500],
  primaryGlow: '0, 102, 204', // rgb 字串給 rgba() 用
} as const;

/**
 * 語義化顏色
 */
export const SEMANTIC_COLORS = {
  // 成功（綠）
  success: ACCENT_COLORS.green[500],
  successLight: ACCENT_COLORS.green[100],

  // 警告（橘）
  warning: '#B25000',
  warningLight: '#FFF3E0',

  // 錯誤（紅）
  error: '#E30000',
  errorLight: '#FFD9D6',

  // 資訊（Action Blue）
  info: PRIMARY_COLORS[500],
  infoLight: PRIMARY_COLORS[100],

  // 中性
  neutral: GRAY_COLORS[600],
  neutralLight: GRAY_COLORS[400],
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
export const LEGACY_INCOME_COLOR = '#248A3D';

/**
 * @deprecated 使用 CHART_COLORS.OUTCOME_PRIMARY 或 MONEY_COLORS.expense
 */
export const LEGACY_OUTCOME_COLOR = '#E30000';

/**
 * @deprecated 使用 CHART_COLORS.NEUTRAL
 */
export const LEGACY_NEUTRAL_COLOR = '#86868B';

/**
 * @deprecated 使用 CHART_COLORS.INCOME_NECESSARY / OUTCOME_NECESSARY
 */
export const LEGACY_NECESSARY_COLOR = '#0071E3';
