export enum Route {
  Base = '/',
  Insert = '/transactions',
  List = '/analysis',
  Budget = '/budget',
  Login = '/login',
  Group = '/group',
  Setting = '/setting',
}

export const MENU_CONFIG: Record<string, string> = {
  [Route.Base]: '首頁',
  [Route.Insert]: '帳目',
  [Route.Group]: '帳本',
  [Route.List]: '分析',
  [Route.Budget]: '預算',
};

export const PAGE_TITLE: Record<string, string> = {
  [Route.Base]: '首頁',
  [Route.Insert]: '帳目瀏覽',
  [Route.Group]: '帳本管理',
  [Route.List]: '消費分析',
  [Route.Budget]: '預算規劃',
  [Route.Login]: '會員登入',
  [Route.Setting]: '設定',
};

export enum SpendingType {
  Income = 'Income',
  Outcome = 'Outcome',
}

export enum Necessity {
  Need = '必',
  NotNeed = '非',
}

const INCOME_TYPE_OPTIONS = ['📈', '💰', '🎁', '✨'];
const INCOME_WORDINGS = ['投資', '薪資', '獎金', '其他'];
export const INCOME_TYPE_MAP = INCOME_TYPE_OPTIONS.map((option, index) => ({
  value: option,
  label: INCOME_WORDINGS[index],
}));

const OUTCOME_TYPE_OPTIONS = [
  '🍔',
  '👗',
  '🏠',
  '🚗',
  '📚',
  '🎲',
  '🧻',
  '💊',
  '📉',
  '✨',
];
const OUTCOME_WORDINGS = [
  '飲食',
  '服飾',
  '住宿',
  '交通',
  '學習',
  '娛樂',
  '日常',
  '醫療',
  '投資',
  '其他',
];
export const OUTCOME_TYPE_MAP = OUTCOME_TYPE_OPTIONS.map((option, index) => ({
  value: option,
  label: OUTCOME_WORDINGS[index],
}));

export const CATEGORY_WORDING_MAP: Record<string, string> = {
  '🍔': '飲食',
  '👗': '服飾',
  '🏠': '住宿',
  '🚗': '交通',
  '📚': '學習',
  '🎲': '娛樂',
  '🧻': '日常',
  '💊': '醫療',
  '📉': '投資',
  '✨': '其他',
  '📈': '投資',
  '💰': '薪資',
  '🎁': '獎金',
};

export const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];

export const DEFAULT_DESC: Record<string, string[]> = {
  '🍔': ['早餐', '午餐', '晚餐', '點心', '飲料'],
  '👗': [],
  '🏠': ['房租', '水費', '電費', '瓦斯費', '網路費', '房貸'],
  '🚗': ['加油', '加值(悠遊)', '加值(高鐵)'],
  '📚': [],
  '🎲': [],
  '🧻': [],
  '💊': [],
  '📉': [],
  '📈': [],
  '💰': ['薪水'],
  '🎁': ['個人績效獎金', '年終獎金', '紅利獎金', '三節獎金'],
  '✨': [],
};

export const MONTH_MAP: Record<string, string> = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Apr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export const MONTH_LABEL: Record<string, string> = {
  Jan: '1',
  Feb: '2',
  Mar: '3',
  Apr: '4',
  May: '5',
  Jun: '6',
  Jul: '7',
  Aug: '8',
  Sep: '9',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

export const BUDGET_PERIOD_OPTIONS = ['yearly', 'monthly', 'weekly', 'daily'];
export const BUDGET_PERIOD_WORDINGS: Record<string, string> = {
  yearly: '每年',
  monthly: '每月',
  weekly: '每週',
  daily: '每日',
};

// Legacy IndexedDB database name — the IDB cache layer has been removed;
// kept only so existing devices can delete the leftover database.
export const IDB_NAME = 'Expense Tracking';
