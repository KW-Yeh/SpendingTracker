import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import { MdOutlineWallet } from 'react-icons/md';

interface Props {
  costList: SpendingRecord[];
}

const UsagePieChart = dynamic(() => import('./UsagePieChart'), {
  ssr: false,
  loading: () => <div className="size-25"></div>,
});

export default function OverView(props: Props) {
  const { costList } = props;
  const { totalIncome, totalOutcome } = getExpenseFromData(costList);
  return (
    <div className="bg-background relative flex w-full items-start justify-between rounded-3xl border border-solid border-gray-300 p-6 text-gray-300 shadow">
      <div className="flex flex-col">
        <span
          className={`mb-4 flex items-center gap-2 text-xs sm:text-sm ${totalIncome !== 0 && totalIncome - totalOutcome < 0 ? 'text-red-400' : 'text-green-400'}`}
        >
          <MdOutlineWallet className="size-6 text-gray-500" />
          <span className="text-3xl leading-9 font-bold">
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
      <UsagePieChart totalIncome={totalIncome} totalOutcome={totalOutcome} />
    </div>
  );
}
