'use client';

import { BudgetSummaryCard } from '@/app/budget/BudgetSummaryCard';
import { MonthlyBudgetBlocks } from '@/app/budget/MonthlyBudgetBlocks';
import { RecurringBudgetItems } from '@/app/budget/RecurringBudgetItems';
import { BudgetSkeleton } from '@/components/skeletons/BudgetSkeleton';
import { NoGroupEmptyState } from '@/components/NoGroupEmptyState';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useMockMode } from '@/hooks/useMockMode';
import { getItems } from '@/services/getRecords';
import { mockRecordsInRange } from '@/utils/mockData';
import { useEffect, useState } from 'react';

function BudgetContent() {
  const { currentGroup } = useGroupCtx();
  const { hasEverLoaded, budget } = useBudgetCtx();
  const mockMode = useMockMode();
  const [yearlySpending, setYearlySpending] = useState<SpendingRecord[]>([]);

  // The month accordions and the year overview both report per-month usage, so
  // this page needs a full year. It fetches its own range instead of sharing
  // the spending context, which PrepareData keeps scoped to the current month.
  useEffect(() => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999).toISOString();

    if (mockMode) {
      setYearlySpending(mockRecordsInRange(startDate, endDate));
      return;
    }
    if (!currentGroup?.account_id) return;

    let cancelled = false;
    void getItems(
      String(currentGroup.account_id),
      undefined,
      startDate,
      endDate,
    ).then((res) => {
      if (cancelled) return;
      if (res.status && Array.isArray(res.data)) setYearlySpending(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [mockMode, currentGroup?.account_id]);

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
