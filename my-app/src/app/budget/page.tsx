'use client';

import { PageTitle } from '@/components/PageTitle';
import { AnnualBudgetSection } from '@/app/budget/AnnualBudgetSection';
import { MonthlyBudgetSection } from '@/app/budget/MonthlyBudgetSection';
import { MonthlyBudgetBlocks } from '@/app/budget/MonthlyBudgetBlocks';
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
      <div className="content-wrapper space-y-3 md:space-y-5">
        {/* Annual Budget Skeleton */}
        <div className="bg-background w-full rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-4">
            <div className="h-9 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-2 w-full animate-pulse rounded-full bg-gray-200" />
            <div className="mt-2 h-5 w-48 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Monthly Budget Skeleton */}
        <div className="bg-background w-full rounded-xl p-6 shadow">
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-4">
            <div className="h-9 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-1 h-4 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-2 w-full animate-pulse rounded-full bg-gray-200" />
            <div className="mt-2 h-5 w-48 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Monthly Blocks Skeleton */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="bg-background rounded-xl p-4 shadow">
              <div className="flex items-center justify-between">
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="mt-2 h-8 w-32 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 space-y-2">
                <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
                <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
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
    <div className="content-wrapper space-y-3 md:space-y-5">
      <div className="flex flex-col md:flex-row gap-3 md:gap-5">
        <AnnualBudgetSection />
        <MonthlyBudgetSection />
      </div>
      <MonthlyBudgetBlocks />
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
