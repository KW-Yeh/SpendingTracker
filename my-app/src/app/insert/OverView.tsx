import { DoubleArrowIcon } from '@/components/icons/DoubleArrowIcon';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const UsagePieChart = dynamic(() => import('./UsagePieChart'), {
  ssr: false,
  loading: () => (
    <div className="aspect-square size-25 animate-pulse rounded-full bg-gray-200 p-2">
      <div className="bg-background size-full rounded-full"></div>
    </div>
  ),
});

interface Props {
  totalIncome: number;
  totalOutcome: number;
  necessaryOutcome: number;
  dateStr: string;
}

export const OverView = (props: Props) => {
  const { totalIncome, totalOutcome, necessaryOutcome, dateStr } = props;
  const year = new Date(dateStr).getFullYear();
  const month = new Date(dateStr).getMonth();

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row">
      <div className="bg-background relative flex h-40 w-full items-center gap-4 rounded-3xl border border-solid border-gray-300 p-2 pl-4 text-gray-300 shadow sm:w-62/100">
        <div className="mx-2 w-25">
          <UsagePieChart budget={totalIncome} usage={totalOutcome} />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="flex items-center gap-1 text-xs sm:text-sm">
            <span>收入</span>
            <span>
              {totalIncome ? `$${normalizeNumber(totalIncome)}` : '$0'}
            </span>
          </span>
          <span className="flex items-center gap-1 text-xs sm:text-sm">
            <span>支出</span>
            <span>
              {totalOutcome ? `$${normalizeNumber(totalOutcome)}` : '$0'}
            </span>
          </span>
          <span
            className={`flex items-center gap-1 text-xs sm:text-sm ${totalIncome !== 0 && totalIncome - totalOutcome < 0 ? 'text-red-400' : 'text-green-400'}`}
          >
            <span>
              {totalIncome && totalIncome - totalOutcome < 0 ? '超支' : '剩餘'}
            </span>
            <span className="text-xl font-bold">
              {totalIncome
                ? `$${normalizeNumber(totalIncome - totalOutcome)}`
                : '$0'}
            </span>
          </span>
        </div>
        <div className="flex h-full items-end p-2">
          <Link
            href="/list"
            className="text-primary-500 active:text-primary-300 sm:hover:text-primary-300 flex items-center text-xs font-bold transition-colors"
          >
            前往分析
            <DoubleArrowIcon className="size-3" />
          </Link>
        </div>

        <span className="absolute top-4 right-4 text-xs">
          {`${year}-${month + 1}`}
        </span>
      </div>

      <ul className="flex w-full list-disc flex-col p-6 sm:w-38/100">
        <li>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm">必要支出</span>
            <span className="text-xs sm:text-sm">
              {totalOutcome
                ? `${((necessaryOutcome * 100) / totalOutcome).toFixed(2)}%`
                : '0%'}
            </span>
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm">財務彈性</span>
            <span className="text-xs sm:text-sm">
              {totalIncome
                ? `${(((totalIncome - necessaryOutcome) * 100) / totalIncome).toFixed(2)}%`
                : '0%'}
            </span>
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm">儲蓄比率</span>
            <span className="text-xs sm:text-sm">
              {totalIncome
                ? `${(((totalIncome - totalOutcome) * 100) / totalIncome).toFixed(2)}%`
                : '0%'}
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};
