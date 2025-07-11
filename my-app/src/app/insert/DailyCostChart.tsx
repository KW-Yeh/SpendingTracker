import { DoubleArrowIcon } from '@/components/icons/DoubleArrowIcon';
import { SpendingType } from '@/utils/constants';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CategoricalChartState } from 'recharts/types/chart/types';

interface Props {
  dateStr: string;
  isMobile: boolean;
  costList: SpendingRecord[];
  handleSelectDataPoint: (state: CategoricalChartState) => void;
}

// const UsageBarChart = dynamic(() => import('./UsageBarChart'), {
//   ssr: false,
// });

const UsageLineChart = dynamic(() => import('./UsageLineChart'), {
  ssr: false,
});

export const DailyCostChart = (props: Props) => {
  const { costList, dateStr, isMobile, handleSelectDataPoint } = props;
  const day = new Date(dateStr);
  const year = day.getFullYear();
  const month = day.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const dailyCost: number[] = new Array(days).fill(0);
  let largestCost = 0;

  costList.forEach((item) => {
    if (item.type === SpendingType.Outcome) {
      const date = new Date(item.date);
      const dayIndex = date.getDate() - 1;
      dailyCost[dayIndex] += item.amount;
      largestCost = Math.max(largestCost, Math.abs(dailyCost[dayIndex]));
    }
  });

  return (
    <div className="bg-background relative flex w-full flex-col items-start rounded-2xl border border-solid border-gray-300 p-6 text-gray-300 shadow">
      <h3 className="text-text text-lg font-semibold">每日花費趨勢圖</h3>
      <div className="flex w-full items-end py-4 text-xs sm:text-sm">
        <UsageLineChart
          month={month}
          data={dailyCost}
          init={new Array(days).fill(0)}
          isMobile={isMobile}
          handleOnClick={handleSelectDataPoint}
        />
      </div>
      <Link
        href="/list"
        className="text-primary-500 active:text-primary-300 hover:text-primary-300 flex items-center self-end text-xs font-bold transition-colors"
      >
        更多分析
        <DoubleArrowIcon className="size-3" />
      </Link>
    </div>
  );
};
