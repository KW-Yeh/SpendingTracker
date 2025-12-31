import { SpendingType, CATEGORY_WORDING_MAP } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { Accordion } from '@/components/Accordion';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { CategoricalChartState } from 'recharts/types/chart/types';

interface Props {
  dateStr: string;
  isMobile: boolean;
  costList: SpendingRecord[];
  onChartClick: (state: CategoricalChartState) => void;
  selectedDate: string | null;
}

const UsageLineChart = dynamic(() => import('./UsageLineChart'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100"></div>
  ),
});

export const MiniDailyCostChart = (props: Props) => {
  const { costList, dateStr, isMobile, onChartClick, selectedDate } = props;
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
      dailyCost[dayIndex] += Number(item.amount);
      largestCost = Math.max(largestCost, Math.abs(dailyCost[dayIndex]));
    }
  });

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return costList.filter((item) => {
      const itemDate = new Date(item.date);
      const formattedDate = `${(itemDate.getMonth() + 1).toString().padStart(2, '0')}/${itemDate.getDate().toString().padStart(2, '0')}`;
      return formattedDate === selectedDate;
    });
  }, [costList, selectedDate]);

  const selectedDayTotal = useMemo(() => {
    return selectedDayTransactions.reduce((sum, item) => {
      if (item.type === SpendingType.Outcome) {
        return sum + Number(item.amount);
      }
      return sum;
    }, 0);
  }, [selectedDayTransactions]);

  return (
    <div className="bg-background relative flex w-full flex-col items-start rounded-2xl border border-solid border-gray-300 p-6 text-gray-700 shadow-sm transition-shadow duration-200 hover:shadow md:min-w-110">
      <h3 className="mb-2 text-lg font-semibold">本月消費趨勢</h3>

      <div className="flex w-full items-end py-4 text-xs sm:text-sm">
        <UsageLineChart
          month={month}
          data={dailyCost}
          init={new Array(days).fill(0)}
          isMobile={isMobile}
          handleOnClick={onChartClick}
        />
      </div>

      {selectedDate && selectedDayTransactions.length > 0 && (
        <div className="mt-4 w-full">
          <Accordion
            summary={(isOpen) => (
              <div className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-600">
                    {selectedDate} 的帳目
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    ${normalizeNumber(selectedDayTotal)}
                  </span>
                </div>
                <svg
                  className={`size-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
            defaultOpen={true}
            className="w-full"
          >
            <div className="mt-2 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3">
              {selectedDayTransactions.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.category}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-gray-700">
                        {item.description || CATEGORY_WORDING_MAP[item.category]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {CATEGORY_WORDING_MAP[item.category]}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      item.type === SpendingType.Income
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {item.type === SpendingType.Income ? '+' : '-'}$
                    {normalizeNumber(Number(item.amount))}
                  </span>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      )}
    </div>
  );
};
