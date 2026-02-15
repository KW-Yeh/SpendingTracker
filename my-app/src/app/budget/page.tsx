'use client';

import { PageTitle } from '@/components/PageTitle';
import { AnnualBudgetSection } from '@/app/budget/AnnualBudgetSection';
import { MonthlyBudgetSection } from '@/app/budget/MonthlyBudgetSection';
import { MonthlyBudgetBlocks } from '@/app/budget/MonthlyBudgetBlocks';
import { BudgetSkeleton } from '@/components/skeletons/BudgetSkeleton';
import { BudgetProvider, useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { useEffect, useMemo } from 'react';

function BudgetContent() {
  const { currentGroup } = useGroupCtx();
  const { syncBudget, loading, isInitialLoad } = useBudgetCtx();
  const { data: spendingData, syncData } = useGetSpendingCtx();

  // Sync budget and spending data from IDB
  useEffect(() => {
    if (!currentGroup?.account_id) return;

    syncBudget(currentGroup.account_id);

    // Sync spending data for current year from IDB
    const now = new Date();
    const { startDate, endDate } = getStartEndOfMonth(now);
    syncData(
      String(currentGroup.account_id),
      undefined,
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [currentGroup?.account_id, syncBudget, syncData]);

  // Use spending data from context as yearly spending (IDB data for the current group)
  const yearlySpending = useMemo(() => spendingData, [spendingData]);

  if (!currentGroup) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <p className="text-gray-300">請先選擇一個帳本</p>
      </div>
    );
  }

  // Show skeleton only on initial load
  if (isInitialLoad && (loading || yearlySpending.length === 0)) {
    return <BudgetSkeleton />;
  }

  // Progressive rendering: Show UI immediately, data will populate when ready
  return (
    <div className="content-wrapper space-y-3 md:space-y-5">
      <div className="grid w-full grid-cols-1 gap-3 md:max-w-250 md:grid-cols-2 md:gap-5">
        <AnnualBudgetSection yearlySpending={yearlySpending} />
        <MonthlyBudgetSection yearlySpending={yearlySpending} />
      </div>
      <MonthlyBudgetBlocks yearlySpending={yearlySpending} />
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
