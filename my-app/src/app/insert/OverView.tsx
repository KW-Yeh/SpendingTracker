'use client';

import { DoubleArrowIcon } from '@/components/icons/DoubleArrowIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { putUser } from '@/services/userServices';
import { DateFilter } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const UsagePieChart = dynamic(() => import('./UsagePieChart'), {
  ssr: false,
  loading: () => (
    <div className="aspect-square size-full rounded-full bg-gray-200 p-[10px]">
      <div className="size-full rounded-full bg-background"></div>
    </div>
  ),
});

interface Props {
  totalIncome: number;
  totalOutcome: number;
  budget?: number;
  usage?: number;
  filter: DateFilter;
  dateStr: string;
}

export const OverView = (props: Props) => {
  const {
    totalIncome,
    totalOutcome,
    budget = 0,
    usage = 0,
    filter,
    dateStr,
  } = props;
  const { syncUser, config: user } = useUserConfigCtx();
  const modalRef = useRef<ModalRef>(null);
  const [budgetList, setBudgetList] = useState<number[]>(Array(12).fill(10000));
  const [isUseAvg, setIsUseAvg] = useState(false);
  const [loading, setLoading] = useState(false);

  const year = useMemo(() => new Date(dateStr).getFullYear(), [dateStr]);
  const month = useMemo(() => new Date(dateStr).getMonth(), [dateStr]);
  const date = useMemo(() => new Date(dateStr).getDate(), [dateStr]);

  const avgBudget = useMemo(
    () => Math.floor(budgetList.reduce((acc, cur) => acc + cur, 0) / 12),
    [budgetList],
  );

  const handleSetAvgBudget = (event: ChangeEvent) => {
    const value = parseInt((event.target as HTMLInputElement).value);
    setBudgetList(Array(12).fill(value));
    setIsUseAvg(true);
  };

  const handleSetBudget = useCallback(() => {
    if (!user) return;
    setLoading(true);
    putUser({
      ...user,
      budgetList,
    }).then(() => {
      syncUser();
      setLoading(false);
      modalRef.current?.close();
    });
  }, [budgetList, syncUser, user]);

  useEffect(() => {
    if (user) {
      setBudgetList(user.budgetList || Array(12).fill(10000));
    }
  }, [user]);

  return (
    <div className="flex w-full flex-col gap-2 sm:max-w-96">
      <div className="relative flex h-28 w-full items-center gap-4 rounded-md border border-solid border-gray-300 p-2 pl-4">
        <div className="w-20">
          <UsagePieChart width={80} height={80} budget={budget} usage={usage} />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
            <span>
              {filter === DateFilter.Day || filter === DateFilter.Month
                ? '每月預算:'
                : '每年預算:'}
            </span>
            <button
              type="button"
              onClick={() => modalRef.current?.open()}
              className="flex items-center gap-1"
            >
              <span>
                {budget !== 0 ? `$${normalizeNumber(budget)}` : '立即設定'}
              </span>
              <EditIcon className="size-3" />
            </button>
          </span>
          <span
            className={`text-base font-bold ${budget !== 0 && budget - usage < 0 ? 'text-red-500' : 'text-green-500'}`}
          >
            {budget && budget - usage < 0 ? '本月超支' : '本月剩餘'}:{' '}
            {budget ? `$${normalizeNumber(budget - usage)}` : '$0'}
          </span>
        </div>
        <div className="flex h-full items-end">
          <Link
            href="/list"
            className="flex items-center text-xs font-light text-blue-500 transition-colors active:text-blue-300 sm:hover:text-blue-300"
          >
            分析
            <DoubleArrowIcon className="size-3" />
          </Link>
        </div>

        <span className="absolute right-2 top-2 text-xs text-gray-500">
          {filter === DateFilter.Day
            ? `${year}-${month + 1}-${date}`
            : filter === DateFilter.Month
              ? `${year}-${month + 1}`
              : year}
        </span>
      </div>
      <div className="flex w-full items-center gap-5">
        <div className="flex flex-1 flex-col rounded-md bg-red-500/50 px-4 py-2 font-semibold">
          <span>支出</span>
          <span>${normalizeNumber(totalOutcome)}</span>
        </div>
        <div className="flex flex-1 flex-col rounded-md bg-green-500/50 px-4 py-2 font-semibold">
          <span>收入</span>
          <span>${normalizeNumber(totalIncome)}</span>
        </div>
      </div>

      <Modal
        ref={modalRef}
        title="設定預算"
        className="flex w-full max-w-96 flex-col gap-2"
      >
        <div
          className={`flex w-full flex-col ${isUseAvg ? 'grayscale-0' : 'grayscale'}`}
        >
          <span>平均每月 ${normalizeNumber(avgBudget)}</span>
          <input
            type="range"
            list="tickmarks"
            min="0"
            max="100000"
            className="flex-1"
            value={avgBudget}
            onChange={handleSetAvgBudget}
          />
        </div>
        <div
          className={`scrollbar flex max-h-96 w-full flex-col gap-2 overflow-y-auto overflow-x-hidden ${isUseAvg ? 'grayscale' : 'grayscale-0'}`}
        >
          {budgetList.map((budget, index) => (
            <div key={index.toString()} className="flex w-full flex-col">
              <span>
                {index + 1}月 ${normalizeNumber(budget)}
              </span>
              <input
                type="range"
                list="tickmarks"
                min="0"
                max="100000"
                className="flex-1"
                value={budget}
                onChange={(event) => {
                  const value = parseInt(
                    (event.target as HTMLInputElement).value,
                  );
                  setBudgetList((prevState) => {
                    const newState = [...prevState];
                    newState[index] = value;
                    return newState;
                  });
                  setIsUseAvg(false);
                }}
              />
            </div>
          ))}
        </div>
        <datalist id="tickmarks">
          <option value="0"></option>
          {Array(9 + 99)
            .fill(1000)
            .map((val, index) => val * (index + 1))
            .map((val) => (
              <option key={val.toString()} value={val}></option>
            ))}
        </datalist>
        <div className="mt-4 flex w-full items-center justify-between">
          <button
            disabled={loading}
            type="button"
            onClick={() => modalRef.current?.close()}
            className="flex w-24 items-center justify-center rounded-lg border border-solid border-red-300 bg-background p-2 text-red-300 transition-colors active:border-red-500 active:text-red-500 sm:hover:border-red-500 sm:hover:text-red-500"
          >
            <span>取消</span>
          </button>
          <button
            disabled={loading}
            type="button"
            onClick={handleSetBudget}
            className="flex w-36 items-center justify-center rounded-lg border border-solid border-text bg-text p-2 text-background transition-all active:bg-gray-600 sm:hover:bg-gray-600"
          >
            {loading && (
              <Loading className="size-6 animate-spin py-1 text-white" />
            )}
            {!loading && <span>送出</span>}
          </button>
        </div>
      </Modal>
    </div>
  );
};
