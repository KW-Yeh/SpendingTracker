interface SpendingInfo {
  total: number;
  income: number;
  outcome: number;
  incomes: SpendingRecord[];
  outcomes: SpendingRecord[];
}

interface SpendingRecord {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface ModalRef {
  open: () => void;
  close: () => void;
}