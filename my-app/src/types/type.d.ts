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
}

interface Group {
  account_id?: number;
  name: string;
  owner_id: number;
  members?: number[]; // 新增：成員 user_id 陣列
  created_at?: string;
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
  created_at?: string;
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

interface PieChartData {
  income: {
    total: number;
    necessary: number;
    unnecessary: number;
    necessaryList: { name: string; value: number; color: string }[];
    unnecessaryList: { name: string; value: number; color: string }[];
    list: PieChartDataItem[];
  };
  outcome: {
    total: number;
    necessary: number;
    unnecessary: number;
    necessaryList: { name: string; value: number; color: string }[];
    unnecessaryList: { name: string; value: number; color: string }[];
    list: PieChartDataItem[];
  };
}

interface PieChartDataBase {
  name: string;
  value: number;
  color: string;
}

interface PieChartDataItem extends PieChartDataBase {
  id: string;
  necessary: number;
  unnecessary: number;
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
  name: string;
  description?: string;
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
