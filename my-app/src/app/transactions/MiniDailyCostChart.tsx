import { SpendingType } from '@/utils/constants';
import dynamic from 'next/dynamic';

interface Props {
  dateStr: string;
  isMobile: boolean;
  costList: SpendingRecord[];
}

const UsageLineChart = dynamic(() => import('./UsageLineChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100"></div>
  ),
});

export const MiniDailyCostChart = (props: Props) => {
  const { costList, dateStr, isMobile } = props;
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
      dailyCost[dayIndex] += Number(item.amount);
      largestCost = Math.max(largestCost, Math.abs(dailyCost[dayIndex]));
    }
  });

  return (
    <div className="bg-background relative flex w-full flex-col items-start rounded-2xl border border-solid border-gray-300 p-6 text-gray-700 shadow-sm transition-shadow duration-200 hover:shadow md:min-w-110">
      <h3 className="mb-2 text-lg font-semibold">本月消費趨勢</h3>

      <div className="flex w-full items-end py-4 text-xs sm:text-sm">
        <UsageLineChart
          month={month}
          data={dailyCost}
          init={new Array(days).fill(0)}
          isMobile={isMobile}
          handleOnClick={() => {}}
        />
      </div>
    </div>
  );
};
