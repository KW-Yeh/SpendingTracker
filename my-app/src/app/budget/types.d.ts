interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: string;
}

interface MonthlyBudgetData {
  month: string;
  [category: string]: string | number;
}
