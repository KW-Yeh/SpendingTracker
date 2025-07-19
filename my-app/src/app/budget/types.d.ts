interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: string;
  note?: string;
}

interface MonthlyBudgetData {
  month: string;
  [category: string]: string | number;
}

interface Allocation {
  id: number;
  name: string;
  budget: number;
  percentage: number;
}
