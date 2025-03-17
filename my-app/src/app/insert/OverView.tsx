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
    <div className="ml-1 aspect-square size-23 animate-pulse rounded-full bg-gray-200 p-2">
      <div className="bg-background size-full rounded-full"></div>
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
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
      <div className="relative flex h-38 items-center gap-4 rounded-3xl border border-solid border-gray-300 p-2 pl-4 max-sm:rounded-b-xl sm:w-105">
        <div className="w-25">
          <UsagePieChart budget={budget} usage={usage} />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
            <span>預算</span>
            <button
              type="button"
              onClick={() => modalRef.current?.open()}
              className="flex items-center gap-1"
            >
              <span>
                {budget !== 0 ? `$${normalizeNumber(budget)}` : '立即設定'}
              </span>
              <EditIcon className="ml-1 size-3" />
            </button>
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
            <span>支出</span>
            <span>{usage ? `$${normalizeNumber(usage)}` : '$0'}</span>
          </span>
          <span
            className={`flex items-center gap-1 text-xs sm:text-sm ${budget !== 0 && budget - usage < 0 ? 'text-red-500' : 'text-green-500'}`}
          >
            <span>{budget && budget - usage < 0 ? '超支' : '剩餘'}</span>
            <span className="text-xl font-bold">
              {budget ? `$${normalizeNumber(budget - usage)}` : '$0'}
            </span>
          </span>
        </div>
        <div className="flex h-full items-end p-2">
          <Link
            href="/list"
            className="flex items-center text-xs font-light text-blue-500 transition-colors active:text-blue-300 sm:hover:text-blue-300"
          >
            分析
            <DoubleArrowIcon className="size-3" />
          </Link>
        </div>

        <span className="absolute top-4 right-4 text-xs text-gray-500">
          {filter === DateFilter.Day
            ? `${year}-${month + 1}-${date}`
            : filter === DateFilter.Month
              ? `${year}-${month + 1}`
              : year}
        </span>
      </div>
      <div className="flex items-center gap-2 max-sm:w-full sm:w-50 sm:flex-col">
        <div className="flex h-full min-h-18 flex-1 items-center justify-between rounded-3xl bg-red-300 px-4 py-2 max-sm:rounded-t-xl sm:w-full sm:rounded-b-xl">
          <span className="text-sm font-semibold text-red-700">支出</span>
          <span className="text-end text-xl font-bold">
            ${normalizeNumber(totalOutcome)}
          </span>
        </div>
        <div className="flex h-full min-h-18 flex-1 items-center justify-between rounded-t-xl rounded-b-3xl bg-green-300 px-4 py-2 sm:w-full">
          <span className="text-sm font-semibold text-green-700">收入</span>
          <span className="text-end text-xl font-bold">
            ${normalizeNumber(totalIncome)}
          </span>
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
          className={`scrollbar flex max-h-96 w-full flex-col gap-2 overflow-x-hidden overflow-y-auto ${isUseAvg ? 'grayscale' : 'grayscale-0'}`}
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
            className="bg-background flex w-24 items-center justify-center rounded-lg border border-solid border-red-300 p-2 text-red-300 transition-colors active:border-red-500 active:text-red-500 sm:hover:border-red-500 sm:hover:text-red-500"
          >
            <span>取消</span>
          </button>
          <button
            disabled={loading}
            type="button"
            onClick={handleSetBudget}
            className="border-text bg-text text-background flex w-36 items-center justify-center rounded-lg border border-solid p-2 transition-all active:bg-gray-600 sm:hover:bg-gray-600"
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
