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
    list: PieChartDataItem[];
  };
  outcome: {
    total: number;
    necessary: number;
    unnecessary: number;
    list: PieChartDataItem[];
  };
}

interface PieChartDataItem {
  id: string;
  name: string;
  value: number;
  necessary: number;
  unnecessary: number;
  color: string;
}
