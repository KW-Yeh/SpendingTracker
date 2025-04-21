'use client';

import { ChartContainer } from '@/app/list/ChartContainer';
import { Filter } from '@/app/list/Filter';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { calSpending2Chart } from '@/utils/calSpending2Chart';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import dynamic from 'next/dynamic';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ExpenseCostTable from './ExpenseCostTable';
import NecessityCostTable from './NecessityCostTable';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const ExpensePieChart = dynamic(() => import('./ExpensePieChart'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-15 aspect-square size-45 rounded-full bg-gray-200 p-1.5">
      <div className="bg-background size-full rounded-full p-1.5">
        <div className="size-full rounded-full bg-gray-200 p-5">
          <div className="bg-background size-full rounded-full"></div>
        </div>
      </div>
    </div>
  ),
});

const NecessityPieChart = dynamic(() => import('./NecessityPieChart'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-15 aspect-square size-45 rounded-full bg-gray-200 p-1.5">
      <div className="bg-background size-full rounded-full p-1.5">
        <div className="size-full rounded-full bg-gray-200 p-5">
          <div className="bg-background size-full rounded-full"></div>
        </div>
      </div>
    </div>
  ),
});

export const ChartBlock = () => {
  useScrollToTop();
  const { config: userData } = useUserConfigCtx();
  const { data, syncData } = useGetSpendingCtx();
  const { groups, loading: loadingGroups } = useGroupCtx();
  const [chartData, setChartData] = useState<PieChartData>({
    income: {
      list: [],
      total: 100,
      necessary: 50,
      unnecessary: 50,
      necessaryList: [],
      unnecessaryList: [],
    },
    outcome: {
      list: [],
      total: 50,
      necessary: 25,
      unnecessary: 25,
      necessaryList: [],
      unnecessaryList: [],
    },
  });
  const today = new Date();
  const [year, setYear] = useState(`${today.getFullYear()}`);
  const [month, setMonth] = useState(`${today.getMonth() + 1}`);
  const [groupId, setGroupId] = useState<string>('');

  const refreshData = useCallback(
    (_groupId: string | undefined, _year: string, _month: string) => {
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(_year), Number(_month) - 1),
      );
      syncData(
        _groupId,
        userData?.email,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData, userData?.email],
  );

  const group = useMemo(
    () => groups.find((group) => group.id === groupId),
    [groups, groupId],
  );

  useEffect(() => {
    startTransition(() => {
      const filteredData = data.filter(
        (record) =>
          `${new Date(record.date).getFullYear()}` === year &&
          `${new Date(record.date).getMonth() + 1}` === month &&
          record.groupId === (groupId || undefined),
      );
      setChartData(calSpending2Chart(filteredData));
    });
  }, [data, year, month, groupId]);

  return (
    <div className="flex w-full max-w-175 flex-col items-center gap-6">
      <div className="flex items-center gap-4 text-base sm:text-lg">
        <Filter
          refreshData={refreshData}
          groupOptions={{
            setGroupId,
            loadingGroups,
            groups,
            group,
          }}
          dateOptions={{
            today,
            year,
            setYear,
            month,
            setMonth,
          }}
        />
      </div>

      <ChartContainer title="收支類別比例">
        <div className="flex w-full flex-wrap justify-center gap-4">
          <div className="size-75 sm:sticky sm:top-20">
            <ExpensePieChart
              totalIncome={chartData.income.total}
              totalOutcome={chartData.outcome.total}
              list={[...chartData.outcome.list, ...chartData.income.list]}
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <ExpenseCostTable
              totalIncome={chartData.income.total}
              totalOutcome={chartData.outcome.total}
              incomeList={chartData.income.list}
              outcomeList={chartData.outcome.list}
            />
          </div>
        </div>
      </ChartContainer>

      <ChartContainer title="支出類別比例（必要 vs 額外）">
        <div className="flex w-full flex-wrap justify-center gap-4">
          <div className="size-75 sm:sticky sm:top-20">
            <NecessityPieChart
              totalNecessity={chartData.outcome.necessary}
              totalUnnecessity={chartData.outcome.unnecessary}
              list={[
                ...chartData.outcome.necessaryList,
                ...chartData.outcome.unnecessaryList,
              ]}
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <NecessityCostTable
              totalNecessary={chartData.outcome.necessary}
              totalUnnecessary={chartData.outcome.unnecessary}
              necessaryList={chartData.outcome.necessaryList}
              unnecessaryList={chartData.outcome.unnecessaryList}
            />
          </div>
        </div>
      </ChartContainer>
    </div>
  );
};
