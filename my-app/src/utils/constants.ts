enum Route {
  Base = '/',
  List = '/list',
  Budget = '/budget',
  Login = '/login',
}

export const MENU_CONFIG: Record<string, string> = {
  [Route.Base]: '首頁',
  [Route.List]: '綜合分析',
  [Route.Budget]: '儲蓄目標',
};

export const PAGE_TITLE: Record<string, string> = {
  [Route.Base]: '首頁',
  [Route.List]: '綜合分析',
  [Route.Budget]: '儲蓄目標',
  [Route.Login]: '會員登入',
};

export enum SpendingType {
  Income = 'Income',
  Outcome = 'Outcome',
}

export enum Necessity {
  Need = '必',
  NotNeed = '非',
}

export const INCOME_TYPE_OPTIONS = ['📈', '💰', '🎁', '✨'];

export const OUTCOME_TYPE_OPTIONS = [
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

export const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];
