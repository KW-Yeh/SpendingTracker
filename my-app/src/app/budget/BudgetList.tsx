'use client';
import { BudgetCard } from '@/app/budget/BudgetCard';
import { useUserConfigCtx } from '@/context/UserConfigProvider';

export const BudgetList = () => {
  const { config: userData } = useUserConfigCtx();

  return (
    <div className="flex w-full flex-row flex-wrap justify-center gap-4 py-5">
      {userData?.budget?.map((budget) => (
        <BudgetCard key={budget.name} budget={budget} />
      ))}
    </div>
  );
};
