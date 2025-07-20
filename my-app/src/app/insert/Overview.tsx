import AddExpenseBtn from '@/app/insert/AddExpenseBtn';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import { MdOutlineWallet } from 'react-icons/md';
import { IoMdArrowUp, IoMdArrowDown } from 'react-icons/io';

interface Props {
  costList: SpendingRecord[];
  isMobile: boolean;
  budgets?: BudgetItem[];
}

const UsagePieChart = dynamic(() => import('./UsagePieChart'), {
  ssr: false,
});

export default function OverView(props: Props) {
  const { budgets, costList, isMobile } = props;
  const { totalIncome, totalOutcome } = getExpenseFromData(costList);
  const balance = totalIncome - totalOutcome;
  const totalBudget =
    budgets?.map((d) => d.amount).reduce((a, b) => a + b, 0) ?? 0;

  return (
    <div className="bg-background relative flex w-full items-center justify-between rounded-2xl border border-solid border-gray-300 p-6 text-gray-700 shadow-sm transition-shadow duration-200 hover:shadow">
      <div className="flex h-full min-h-35 flex-col md:min-h-50">
        <div className="mb-2">
          <h3 className="mb-1 text-sm font-medium text-gray-500">剩餘預算</h3>
          <span className="flex items-center gap-2">
            <MdOutlineWallet className="text-primary-400 size-6" />
            <span className="text-primary-500 text-xl leading-12 font-bold sm:text-3xl">
              {`$${normalizeNumber(totalBudget - totalOutcome)}`}
            </span>
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <IoMdArrowUp className="text-green-500" />
              <span>收入</span>
            </span>
            <span className="font-medium text-green-600">
              {totalIncome ? `$${normalizeNumber(totalIncome)}` : '$0'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <IoMdArrowDown className="text-red-500" />
              <span>支出</span>
            </span>
            <span className="font-medium text-red-600">
              {totalOutcome ? `$${normalizeNumber(totalOutcome)}` : '$0'}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-1 text-sm">
            <span className="text-gray-500">剩餘</span>
            <span
              className={`font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {`$${normalizeNumber(balance)}`}
            </span>
          </div>
        </div>

        <AddExpenseBtn className="mt-auto text-sm sm:text-base">
          立即新增帳目
        </AddExpenseBtn>
      </div>
      <UsagePieChart
        totalIncome={totalBudget}
        totalOutcome={totalOutcome}
        isMobile={isMobile}
      />
    </div>
  );
}
