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
  image: string;
};

interface User {
  user_id: number;
  name: string;
  email: string;
  image: string;
  groups: string[];
  budgetList?: number[];
  allocation?: Allocation[];
  monthlyPlan?: MonthlyPlan[];
  desc?: Record<string, string[]>;
  budget?: BudgetItem[];
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
