interface SpendingRecord {
  id: string;
  'user-token': string;
  groupId?: string;
  type: string;
  date: string;
  necessity: string;
  amount: number;
  category: string;
  description: string;
}

interface Group {
  id: string;
  users: MemberType[];
  name: string;
}

type MemberType = {
  name: string;
  email: string;
  image: string;
};

interface User {
  name: string;
  email: string;
  image: string;
  groups: string[];
  budgetList?: number[];
  allocation: Allocation[];
  desc?: Record<string, string[]>;
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
