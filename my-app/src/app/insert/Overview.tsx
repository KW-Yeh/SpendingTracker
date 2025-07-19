import AddExpenseBtn from '@/app/insert/AddExpenseBtn';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import { MdOutlineWallet } from 'react-icons/md';
import { IoMdArrowUp, IoMdArrowDown } from 'react-icons/io';

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
  const balance = totalIncome - totalOutcome;
  
  return (
    <div className="bg-background relative flex w-full items-center justify-between rounded-2xl border border-solid border-gray-300 p-6 text-gray-700 shadow-sm hover:shadow transition-shadow duration-200">
      <div className="flex h-full min-h-35 flex-col md:min-h-50">
        <div className="mb-2">
          <h3 className="text-sm text-gray-500 font-medium mb-1">總支出</h3>
          <span className="flex items-center gap-2">
            <MdOutlineWallet className="text-primary-400 size-6" />
            <span className="text-primary-500 text-xl leading-12 font-bold sm:text-3xl">
              {totalOutcome ? `$${normalizeNumber(totalOutcome)}` : '$0'}
            </span>
          </span>
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <IoMdArrowUp className="text-green-500" />
              <span>收入</span>
            </span>
            <span className="font-medium text-green-600">{totalIncome ? `$${normalizeNumber(totalIncome)}` : '$0'}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <IoMdArrowDown className="text-red-500" />
              <span>支出</span>
            </span>
            <span className="font-medium text-red-600">{totalOutcome ? `$${normalizeNumber(totalOutcome)}` : '$0'}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-100 mt-1">
            <span className="text-gray-500">剩餘</span>
            <span className={`font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {`$${normalizeNumber(balance)}`}
            </span>
          </div>
        </div>

        <AddExpenseBtn className="mt-auto text-sm sm:text-base">
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
