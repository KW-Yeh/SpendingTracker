'use client';

import { PageTitle } from '@/components/PageTitle';
import { AnnualBudgetSection } from '@/app/budget/AnnualBudgetSection';
import { MonthlyBudgetSection } from '@/app/budget/MonthlyBudgetSection';
import { MonthlyItemsList } from '@/app/budget/MonthlyItemsList';
import { BudgetProvider, useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useEffect } from 'react';

function BudgetContent() {
  const { currentGroup } = useGroupCtx();
  const { syncBudget, loading } = useBudgetCtx();

  useEffect(() => {
    if (currentGroup?.account_id) {
      syncBudget(currentGroup.account_id);
    }
  }, [currentGroup?.account_id, syncBudget]);

  if (loading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <p className="text-gray-400">請先選擇一個帳本</p>
      </div>
    );
  }

  return (
    <div className="content-wrapper space-y-6">
      <AnnualBudgetSection />
      <MonthlyBudgetSection />
      <MonthlyItemsList />
    </div>
  );
}

export default function BudgetPage() {
  return (
    <div className="bg-soft relative flex w-full flex-1 flex-col">
      <PageTitle>預算管理</PageTitle>
      <BudgetProvider>
        <BudgetContent />
      </BudgetProvider>
    </div>
  );
}
