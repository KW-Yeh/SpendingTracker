'use client';

import { PageTitle } from '@/components/PageTitle';
import { AnnualBudgetSection } from '@/app/budget/AnnualBudgetSection';
import { MonthlyBudgetSection } from '@/app/budget/MonthlyBudgetSection';
import { MonthlyBudgetBlocks } from '@/app/budget/MonthlyBudgetBlocks';
import { BudgetProvider, useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { getItems } from '@/services/getRecords';
import { useEffect, useState, startTransition } from 'react';

function BudgetContent() {
  const { currentGroup } = useGroupCtx();
  const { syncBudget } = useBudgetCtx();
  const [yearlySpending, setYearlySpending] = useState<SpendingRecord[]>([]);

  // Parallel fetch: budget and spending data simultaneously
  useEffect(() => {
    if (!currentGroup?.account_id) return;

    const accountId = currentGroup.account_id;

    // Fetch both budget and spending data in parallel
    Promise.all([
      syncBudget(accountId),
      (async () => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

        const response = await getItems(
          String(accountId),
          undefined,
          startOfYear.toISOString(),
          endOfYear.toISOString(),
        );

        if (response.status && response.data) {
          // Use startTransition to make UI update non-blocking
          startTransition(() => {
            setYearlySpending(response.data);
          });
        }
      })(),
    ]).catch((error) => {
      console.error('[BudgetPage] Error fetching data:', error);
    });
  }, [currentGroup?.account_id, syncBudget]);

  if (!currentGroup) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <p className="text-gray-400">請先選擇一個帳本</p>
      </div>
    );
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
