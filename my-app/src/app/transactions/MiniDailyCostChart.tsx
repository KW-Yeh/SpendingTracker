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
    <div className="h-64 w-full animate-pulse rounded-lg bg-gray-700/50"></div>
  ),
});

export const MiniDailyCostChart = (props: Props) => {
  const { costList, dateStr, isMobile, onChartClick, selectedDate } = props;
  const day = new Date(dateStr);
  const year = day.getFullYear();
  const month = day.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const dailyCost: number[] = new Array(days).fill(0);

  costList.forEach((item) => {
    if (item.type === SpendingType.Outcome) {
      const date = new Date(item.date);
      const dayIndex = date.getDate() - 1;
      dailyCost[dayIndex] += Number(item.amount);
    }
  });

  const totalCost = dailyCost.reduce((sum, c) => sum + c, 0);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const elapsedDays = isCurrentMonth ? today.getDate() : days;
  const avgPerDay = elapsedDays > 0 ? Math.round(totalCost / elapsedDays) : 0;

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
    <div
      className="relative flex w-full flex-col items-start rounded-2xl border border-black/[0.08] bg-gray-950 p-5 text-gray-300 backdrop-blur-sm md:min-w-110"
      style={{ textWrap: 'pretty' }}
    >
      <div className="flex w-full items-baseline justify-between">
        <span
          className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 uppercase"
          style={{ letterSpacing: '0.12em' }}
        >
          本月消費趨勢
        </span>
        <span
          className="text-[11px] font-medium text-gray-400"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          平均 ${normalizeNumber(avgPerDay)} / 天
        </span>
      </div>

      <div className="flex w-full items-end pt-3 pb-1 text-xs sm:text-sm">
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
              <div className="flex w-full items-center justify-between rounded-lg bg-gray-800 p-4 transition-all duration-200 hover:bg-gray-700/60">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-400">
                    {selectedDate} 的帳目
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: 'var(--color-expense)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ${normalizeNumber(selectedDayTotal)}
                  </span>
                </div>
                <svg
                  className={`size-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            <div className="mt-2 flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-950/90 p-3">
              {selectedDayTransactions.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-gray-700/60 bg-gray-900 p-3 text-sm transition-all duration-200 hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.category}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-gray-200">
                        {item.description ||
                          CATEGORY_WORDING_MAP[item.category]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {CATEGORY_WORDING_MAP[item.category]}
                      </span>
                    </div>
                  </div>
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        item.type === SpendingType.Income
                          ? 'var(--color-income)'
                          : 'var(--color-expense)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
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
