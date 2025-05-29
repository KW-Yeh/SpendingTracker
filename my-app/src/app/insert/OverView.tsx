import { DoubleArrowIcon } from '@/components/icons/DoubleArrowIcon';
import { SpendingType } from '@/utils/constants';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MdOutlineWallet } from 'react-icons/md';
import { CategoricalChartState } from 'recharts/types/chart/types';

interface Props {
  dateStr: string;
  costList: SpendingRecord[];
  handleSelectDataPoint: (state: CategoricalChartState) => void;
}

const UsagePieChart = dynamic(() => import('./UsagePieChart'), {
  ssr: false,
});

export const OverView = (props: Props) => {
  const { costList, dateStr, handleSelectDataPoint } = props;
  const { totalIncome, totalOutcome } = getExpenseFromData(costList);
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
    <div className="bg-background relative flex w-full flex-col items-start rounded-3xl border border-solid border-gray-300 p-6 text-gray-300 shadow">
      <div className="flex w-full flex-col">
        <span
          className={`flex items-center gap-1 text-xs sm:text-sm ${totalIncome !== 0 && totalIncome - totalOutcome < 0 ? 'text-red-400' : 'text-green-400'}`}
        >
          <MdOutlineWallet className="size-6 text-gray-500" />
          <span className="text-3xl leading-9 font-semibold">
            {totalIncome
              ? `$${normalizeNumber(totalIncome - totalOutcome)}`
              : '$0'}
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-300 sm:text-sm">
          <span>收入</span>
          <span>{totalIncome ? `$${normalizeNumber(totalIncome)}` : '$0'}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-300 sm:text-sm">
          <span>支出</span>
          <span>
            {totalOutcome ? `$${normalizeNumber(totalOutcome)}` : '$0'}
          </span>
        </span>
      </div>

      <div className="flex w-full items-end py-10 text-sm max-sm:hidden">
        <UsagePieChart
          month={month}
          data={dailyCost}
          init={new Array(days).fill(0)}
          handleOnClick={handleSelectDataPoint}
        />
      </div>

      <Link
        href="/list"
        className="text-primary-500 active:text-primary-300 hover:text-primary-300 absolute right-4 bottom-4 flex items-center text-xs font-bold transition-colors"
      >
        前往分析
        <DoubleArrowIcon className="size-3" />
      </Link>
    </div>
  );
};
