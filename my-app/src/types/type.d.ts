interface SpendingRecord {
  id: string;
  'user-token': string;
  groupId?: string;
  type: string;
  date: string;
  necessity: string;
  amount: string;
  category: string;
  description: string;
  updated_at?: string;
}

interface Group {
  account_id?: number;
  name: string;
  owner_id: number;
  members?: number[]; // 新增：成員 user_id 陣列
  created_at?: string;
  updated_at?: string;
  // 擴充資訊
  owner_email?: string;
  owner_name?: string;
  member_count?: number;
  user_role?: string;
}

interface GroupMember {
  account_id: number;
  user_id: number;
  role: string;
  joined_at: string;
  updated_at?: string;
  // 使用者資訊
  email?: string;
  name?: string;
}

interface GroupStats {
  total_transactions: number;
  total_outcome: number;
  total_income: number;
  net_amount: number;
  member_count: number;
}

type MemberType = {
  name: string;
  email: string;
};

interface User {
  user_id: number;
  name: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserBudgetData {
  budget: BudgetItem[];
}

interface BudgetItem {
  name: string;
  category: string;
  amount: number;
  period: string;
}

interface MonthlyPlan {
  month: number;
  budget: number;
  percentage: number;
}

interface Allocation {
  id: number;
  name: string;
  budget: number;
  percentage: number;
}

interface ModalRef {
  open: () => void;
  close: () => void;
}

interface AnalysisMonthlyPoint {
  key: string;
  label: string;
  income: number;
  outcome: number;
  necessary: number;
  unnecessary: number;
  necessaryPercent: number;
  unnecessaryPercent: number;
  movingAverage: number;
  budget: number;
}

interface AnalysisCategoryChange {
  category: string;
  label: string;
  current: number;
  previous: number;
  change: number;
}

interface AnalysisBudgetProgress {
  category: string;
  label: string;
  budgeted: number;
  spent: number;
  remaining: number;
  usagePercent: number;
  isOver: boolean;
}

interface AnalysisDashboardData {
  selectedMonthLabel: string;
  previousMonthLabel: string;
  months: AnalysisMonthlyPoint[];
  necessityMonths: AnalysisMonthlyPoint[];
  categoryChanges: AnalysisCategoryChange[];
  budgetProgress: AnalysisBudgetProgress[];
  summary: {
    outcome: number;
    income: number;
    net: number;
    previousDelta: number;
    previousChangePercent: number | null;
    budgeted: number;
    budgetUsagePercent: number | null;
  };
}

// New Budget Schema Types
interface Budget {
  budget_id: number;
  account_id: number;
  annual_budget: number;
  monthly_budget: number;
  monthly_items: MonthlyBudgetItem[];
  created_at?: string;
  updated_at?: string;
}

interface MonthlyBudgetItem {
  category: string; // emoji category (e.g., '🍔', '🏠', '💰') - matches transaction categories
  description: string; // descriptive text (e.g., '午餐', '房租', '薪水')
  months: {
    [key: string]: number; // month: amount (e.g., "1": 5000, "2": 5500)
  };
}

// New simplified structure for month-based budget items
interface MonthBudgetItem {
  item_id?: string;
  name: string;
  amount: number;
}

interface MonthBudget {
  month: number; // 1-12
  items: MonthBudgetItem[];
  total: number; // auto-calculated from items
}

interface FavoriteCategories {
  category_id: number;
  owner_id: number;
  food?: string;
  clothing?: string;
  housing?: string;
  transportation?: string;
  education?: string;
  entertainment?: string;
  daily?: string;
  medical?: string;
  investment?: string;
  other?: string;
  salary?: string;
  bonus?: string;
  created_at?: string;
  updated_at?: string;
}

// Sync-related types (used by /api/aurora/sync)
interface SyncPullResponse {
  user: User | null;
  groups: Group[];
  members: Record<number, GroupMember[]>; // keyed by account_id
  transactions: Record<string, SpendingRecord[]>; // keyed by "groupId_year_month"
  budgets: Budget[];
  favorites: FavoriteCategories | null;
}

interface SyncPushPayload {
  user: User;
  transactions: SpendingRecord[];
  budgets: Budget[];
  favorites: FavoriteCategories | null;
}

interface MonthlyStatistic {
  total_outcome: number;
  total_income: number;
  transaction_count: number;
}

// Keyed by month number 1-12, as a string once it round-trips through JSON.
type MonthlyStatistics = Record<string, MonthlyStatistic>;

// Helper type for category keys
type CategoryKey =
  | 'food'
  | 'clothing'
  | 'housing'
  | 'transportation'
  | 'education'
  | 'entertainment'
  | 'daily'
  | 'medical'
  | 'investment'
  | 'other'
  | 'salary'
  | 'bonus';
