import { DoubleArrowIcon } from '@/components/icons/DoubleArrowIcon';
import { SpendingType } from '@/utils/constants';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo } from 'react';
import { CategoricalChartState } from 'recharts/types/chart/types';

interface Props {
  dateStr: string;
  isMobile: boolean;
  costList: SpendingRecord[];
  handleSelectDataPoint: (state: CategoricalChartState) => void;
}

const UsageLineChart = dynamic(() => import('./UsageLineChart'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100"></div>
});

export const DailyCostChart = (props: Props) => {
  const { costList, dateStr, isMobile, handleSelectDataPoint } = props;
  const day = new Date(dateStr);
  const year = day.getFullYear();
  const month = day.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  // Memoize expensive calculation
  const dailyCost = useMemo(() => {
    const costs: number[] = new Array(days).fill(0);

    costList.forEach((item) => {
      if (item.type === SpendingType.Outcome) {
        const date = new Date(item.date);
        const dayIndex = date.getDate() - 1;
        costs[dayIndex] += Number(item.amount);
      }
    });

    return costs;
  }, [costList, days]);

  // Get month name in Chinese
  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const monthName = monthNames[month];

  return (
    <div className="bg-background relative flex w-full flex-col items-start rounded-2xl border border-solid border-gray-300 p-6 text-gray-700 shadow-sm hover:shadow transition-shadow duration-200">
      <div className="flex w-full items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{monthName}花費趨勢</h3>
        <Link
          href="/list"
          className="text-primary-500 active:text-primary-600 hover:text-primary-400 flex items-center gap-1 text-xs font-bold transition-colors"
        >
          更多分析
          <DoubleArrowIcon className="size-3" />
        </Link>
      </div>
      
      <div className="flex w-full items-end py-4 text-xs sm:text-sm">
        <UsageLineChart
          month={month}
          data={dailyCost}
          init={new Array(days).fill(0)}
          isMobile={isMobile}
          handleOnClick={handleSelectDataPoint}
        />
      </div>
      
      <div className="w-full text-xs text-gray-500 mt-2">
        點擊圖表上的點可查看當日消費明細
      </div>
    </div>
  );
};
