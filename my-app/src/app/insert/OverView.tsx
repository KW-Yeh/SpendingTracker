import { DoubleArrowIcon } from '@/components/icons/DoubleArrowIcon';
import { SpendingType } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import Link from 'next/link';

interface Props {
  totalIncome: number;
  totalOutcome: number;
  dateStr: string;
  costList: SpendingRecord[];
}

export const OverView = (props: Props) => {
  const { totalIncome, totalOutcome, costList, dateStr } = props;
  const year = new Date(dateStr).getFullYear();
  const month = new Date(dateStr).getMonth();
  const days = new Date(year, month, 0).getDate();
  const dailyCost: number[] = new Array(days).fill(0);
  let largestCost = 0;

  costList.forEach((item) => {
    if (item.type === SpendingType.Outcome) {
      const date = new Date(item.date);
      const dayIndex = date.getDate() - 1;
      dailyCost[dayIndex] += item.amount;
      largestCost = Math.max(largestCost, Math.abs(item.amount));
    }
  });

  return (
    <div className="bg-background relative flex w-full flex-col items-start rounded-3xl border border-solid border-gray-300 p-6 text-gray-300 shadow">
      <div className="flex w-full flex-col">
        <span
          className={`flex items-center gap-1 text-xs sm:text-sm ${totalIncome !== 0 && totalIncome - totalOutcome < 0 ? 'text-red-400' : 'text-green-400'}`}
        >
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

      <div className="flex h-50 w-full items-end gap-0.5 pb-10">
        {dailyCost.map((cost, i) => (
          <div
            key={`${year}-${month}-${i.toString()}`}
            className="group relative flex h-full w-fit flex-col items-center justify-end"
            style={{
              width: `${100 / days}%`,
            }}
          >
            <span
              className="absolute h-6 w-px bg-gray-300 opacity-0 transition-opacity select-none group-hover:opacity-100 group-active:opacity-100"
              style={{
                bottom: `${(cost * 100) / largestCost}%`,
              }}
            ></span>
            <span
              className="w-1.25 rounded-t-full border-b border-solid border-red-300 bg-red-300 outline-red-100 group-hover:bg-red-500 group-hover:shadow-[0_-2px_6px_0_#fb2c36] group-hover:outline-1 group-active:bg-red-500 group-active:outline-1"
              style={{
                height: `${(cost * 100) / largestCost}%`,
              }}
            ></span>
            <span className="absolute top-full mt-1 text-xs select-none">
              {i % 10 === 0 ? i + 1 : ''}
            </span>
            <p
              className="bg-background text-text absolute z-10 mb-6 rounded-md border border-solid border-gray-300 px-2 py-1 text-center text-xs whitespace-nowrap opacity-0 shadow transition-opacity select-none group-hover:opacity-100 group-active:opacity-100"
              style={{
                bottom: `${(cost * 100) / largestCost}%`,
              }}
            >
              {`${month}/${i + 1} $${normalizeNumber(cost)}`}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/list"
        className="text-primary-500 active:text-primary-300 sm:hover:text-primary-300 absolute right-4 bottom-4 flex items-center text-xs font-bold transition-colors"
      >
        前往分析
        <DoubleArrowIcon className="size-3" />
      </Link>

      <span className="absolute top-4 right-4 text-xs">
        {`${year}-${month + 1}`}
      </span>
    </div>
  );
};
