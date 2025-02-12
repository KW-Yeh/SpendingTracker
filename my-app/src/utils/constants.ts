export enum Route {
  Base = '/',
  Insert = '/insert',
  List = '/list',
  Budget = '/budget',
  Login = '/login',
  Group = '/group',
  Setting = '/setting',
}

export const MENU_CONFIG: Record<string, string> = {
  [Route.Base]: '首頁',
  [Route.Insert]: '記帳',
  [Route.Group]: '群組',
  [Route.List]: '分析',
  [Route.Budget]: '儲蓄',
};

export const PAGE_TITLE: Record<string, string> = {
  [Route.Base]: '首頁',
  [Route.Insert]: '記帳',
  [Route.Group]: '群組',
  [Route.List]: '分析',
  [Route.Budget]: '儲蓄',
  [Route.Login]: '會員',
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
}))

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

export const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];

export enum DateFilter {
  Day = 'Day',
  Month = 'Month',
  Year = 'Year',
}