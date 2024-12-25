export const ROUTE_TITLE: Record<string, string> = {
  '/': '主畫面',
  '/list': '總表',
  '/budget': '儲蓄目標',
  '/login': '會員登入',
};

export enum SpendingType {
  Income = 'Income',
  Outcome = 'Outcome',
}

export enum Necessity {
  Need = '必',
  NotNeed = '非',
}

export const INCOME_TYPE_OPTIONS = [
  '📈',
  '💰',
  '🎁',
  '✨',
];

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
