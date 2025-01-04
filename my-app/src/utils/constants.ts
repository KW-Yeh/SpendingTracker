export enum Route {
  Base = '/',
  Insert = '/insert',
  List = '/list',
  Budget = '/budget',
  Login = '/login',
  Group = '/group',
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

export const USER_TOKEN_SEPARATOR = ';group:';
