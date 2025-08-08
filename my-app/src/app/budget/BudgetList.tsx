'use client';
import { BudgetCard } from '@/app/budget/BudgetCard';
import { useBudget } from '@/hooks/useBudget';

export const BudgetList = () => {
  const { budgets } = useBudget();

  return (
    <div className="flex w-full flex-row flex-wrap justify-center gap-4 py-5">
      {budgets.map((budget) => (
        <BudgetCard key={budget.name} budget={budget} />
      ))}
    </div>
  );
};
