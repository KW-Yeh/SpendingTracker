'use client';

import { AnalysisKpiGrid } from '@/app/analysis/AnalysisKpiGrid';
import { BudgetProgressList } from '@/app/analysis/BudgetProgressList';
import { PageControlBar } from '@/composites/PageControlBar';
import { createMockRecords, MOCK_BUDGET, MOCK_GROUP } from '@/utils/mockData';
import { NoGroupEmptyState } from '@/components/NoGroupEmptyState';
import { AnalysisSkeleton } from '@/components/skeletons/AnalysisSkeleton';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useYearMonth } from '@/hooks/useYearMonth';
import { getItems } from '@/services/getRecords';
import { buildAnalysisDashboard } from '@/utils/buildAnalysisDashboard';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

const SpendingTrendChart = dynamic(
  () => import('./AnalysisCharts').then((module) => module.SpendingTrendChart),
  { ssr: false },
);
const CategoryChangeChart = dynamic(
  () => import('./AnalysisCharts').then((module) => module.CategoryChangeChart),
  { ssr: false },
);
const NecessityTrendChart = dynamic(
  () => import('./AnalysisCharts').then((module) => module.NecessityTrendChart),
  { ssr: false },
);

const getAnalysisRange = (anchor: Date) => ({
  startDate: new Date(
    anchor.getFullYear(),
    anchor.getMonth() - 12,
    1,
  ).toISOString(),
  endDate: new Date(
    anchor.getFullYear(),
    anchor.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  ).toISOString(),
});

export const ChartBlock = ({ mockMode = false }: { mockMode?: boolean }) => {
  useScrollToTop();
  const { currentGroup } = useGroupCtx();
  const { budget } = useBudgetCtx();
  const dateHook = useYearMonth(new Date());
  const [records, setRecords] = useState<SpendingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(!mockMode);
  const [errorMessage, setErrorMessage] = useState('');
  const anchor = useMemo(
    () => new Date(Number(dateHook.year), Number(dateHook.month) - 1, 1),
    [dateHook.month, dateHook.year],
  );
  const activeGroup = mockMode ? MOCK_GROUP : currentGroup;
  const activeBudget = mockMode ? MOCK_BUDGET : budget;

  useEffect(() => {
    if (mockMode) {
      setRecords(createMockRecords(anchor));
      setErrorMessage('');
      setIsLoading(false);
      return;
    }

    if (!currentGroup?.account_id) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const loadAnalysis = async () => {
      setIsLoading(true);
      setErrorMessage('');
      const range = getAnalysisRange(anchor);
      const response = await getItems(
        String(currentGroup.account_id),
        undefined,
        range.startDate,
        range.endDate,
      );
      if (cancelled) return;

      if (response.status && Array.isArray(response.data)) {
        setRecords(response.data);
      } else {
        setRecords([]);
        setErrorMessage(response.message || '分析資料載入失敗');
      }
      setIsLoading(false);
    };

    void loadAnalysis();
    return () => {
      cancelled = true;
    };
  }, [anchor, currentGroup?.account_id, mockMode]);

  const analysis = useMemo(
    () => buildAnalysisDashboard(records, activeBudget, anchor),
    [activeBudget, anchor, records],
  );

  if (!activeGroup) {
    return <NoGroupEmptyState>{null}</NoGroupEmptyState>;
  }

  if (isLoading && records.length === 0) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="content-wrapper !items-stretch !gap-5 lg:max-w-7xl">
      <PageControlBar dateOptions={dateHook} />

      <div className="flex flex-col gap-0.5 pt-1">
        <h1
          className="font-semibold text-gray-100"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '28px',
            letterSpacing: '-0.015em',
          }}
        >
          消費分析
        </h1>
        <span className="text-xs font-semibold text-gray-400">
          {activeGroup.name} · {analysis.selectedMonthLabel}
        </span>
      </div>

      {mockMode && (
        <div className="border-primary-200 bg-primary-50 text-primary-700 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm">
          <span className="font-semibold">Mock data 驗證模式</span>
          <span className="hidden text-xs sm:inline">不會呼叫真實交易 API</span>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-[var(--color-expense)]/20 bg-[var(--color-expense-bg)] px-4 py-3 text-sm text-[var(--color-expense)]"
        >
          {errorMessage}
        </div>
      )}

      <AnalysisKpiGrid data={analysis} />
      <SpendingTrendChart months={analysis.months} />

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <CategoryChangeChart
          changes={analysis.categoryChanges}
          previousMonthLabel={analysis.previousMonthLabel}
        />
        <NecessityTrendChart months={analysis.necessityMonths} />
      </div>

      <BudgetProgressList items={analysis.budgetProgress} />
    </div>
  );
};
