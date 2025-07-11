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
    <div className="bg-background relative flex w-full items-center justify-between rounded-2xl border border-solid border-gray-300 p-6 text-gray-300 shadow">
      <div className="flex h-full min-h-35 flex-col md:min-h-50">
        <span className="flex items-center gap-2 text-xs sm:text-sm">
          <MdOutlineWallet className="text-primary-400 size-6" />
          <span className="text-primary-400 text-xl leading-12 font-bold sm:text-3xl">
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
