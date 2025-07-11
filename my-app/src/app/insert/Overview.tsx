import AddExpenseBtn from '@/app/insert/AddExpenseBtn';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import { MdOutlineWallet } from 'react-icons/md';

interface Props {
  costList: SpendingRecord[];
  isMobile: boolean;
}

const UsagePieChart = dynamic(() => import('./UsagePieChart'), {
  ssr: false,
});

export default function OverView(props: Props) {
  const { costList, isMobile } = props;
  const { totalIncome, totalOutcome } = getExpenseFromData(costList);
  return (
    <div className="bg-background relative flex w-full items-start justify-between rounded-2xl border border-solid border-gray-300 p-6 text-gray-300 shadow md:items-center">
      <div className="flex h-full min-h-30 flex-col md:min-h-50">
        <span className="flex items-center gap-2 text-xs leading-10 sm:text-sm">
          <MdOutlineWallet className="size-6 text-gray-500" />
          <span className="text-xl leading-9 font-bold text-red-400 sm:text-3xl">
            {totalOutcome ? `$${normalizeNumber(totalOutcome)}` : '$0'}
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-300 sm:text-sm">
          <span>收入</span>
          <span>{totalIncome ? `$${normalizeNumber(totalIncome)}` : '$0'}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-300 sm:text-sm">
          <span>剩餘</span>
          <span>
            {totalIncome
              ? `$${normalizeNumber(totalIncome - totalOutcome)}`
              : '$0'}
          </span>
        </span>

        <AddExpenseBtn className="mt-auto text-sm sm:text-lg">
          立即新增帳目
        </AddExpenseBtn>
      </div>
      <UsagePieChart
        totalIncome={totalIncome}
        totalOutcome={totalOutcome}
        isMobile={isMobile}
      />
    </div>
  );
}
