'use client';

import { BudgetSummaryCard } from '@/app/budget/BudgetSummaryCard';
import { MonthlyBudgetBlocks } from '@/app/budget/MonthlyBudgetBlocks';
import { RecurringBudgetItems } from '@/app/budget/RecurringBudgetItems';
import { BudgetSkeleton } from '@/components/skeletons/BudgetSkeleton';
import { NoGroupEmptyState } from '@/components/NoGroupEmptyState';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { useEffect, useMemo, useState } from 'react';

function BudgetContent() {
  const { currentGroup } = useGroupCtx();
  const { hasEverLoaded, budget } = useBudgetCtx();
  const { data: spendingData, syncData } = useGetSpendingCtx();

  // Sync spending data for current year from IDB
  useEffect(() => {
    if (!currentGroup?.account_id) return;

    const now = new Date();
    const { startDate, endDate } = getStartEndOfMonth(now);
    syncData(
      String(currentGroup.account_id),
      undefined,
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [currentGroup?.account_id, syncData]);

  // Use spending data from context as yearly spending (IDB data for the current group)
  const yearlySpending = useMemo(() => spendingData, [spendingData]);

  if (!currentGroup) {
    return <NoGroupEmptyState>{null}</NoGroupEmptyState>;
  }

  // Only show the skeleton when we genuinely have nothing to render yet.
  if (!hasEverLoaded && !budget) {
    return <BudgetSkeleton />;
  }

  // Progressive rendering: Show UI immediately, data will populate when ready
  return (
    <div className="content-wrapper space-y-3 md:space-y-5">
      <BudgetSummaryCard yearlySpending={yearlySpending} />
      <RecurringBudgetItems />
      <MonthlyBudgetBlocks yearlySpending={yearlySpending} />
    </div>
  );
}

function BudgetHero() {
  const { currentGroup } = useGroupCtx();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const sub = [currentGroup?.name, now ? `${now.getFullYear()} 年` : '']
    .filter(Boolean)
    .join(' · ');
  return (
    <div
      className="content-wrapper !gap-0.5 !pb-2"
      style={{ alignItems: 'flex-start', textWrap: 'pretty' }}
    >
      <h1
        className="font-semibold text-gray-100"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          letterSpacing: '-0.015em',
        }}
      >
        預算規劃
      </h1>
      <span className="text-xs font-semibold text-gray-400">{sub}</span>
    </div>
  );
}

export default function BudgetPage() {
  return (
    <div className="bg-soft relative flex w-full flex-1 flex-col">
      <BudgetHero />
      <BudgetContent />
    </div>
  );
}
