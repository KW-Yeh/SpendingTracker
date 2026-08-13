import { SpendingType } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { SpendingProgressPoint } from './SpendingProgressChart';

interface Props {
  year: number;
  month: number;
  isMobile: boolean;
  costList: SpendingRecord[];
  monthlyBudget: number;
}

const SpendingProgressChart = dynamic(() => import('./SpendingProgressChart'), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full animate-pulse rounded-xl bg-gray-800" />
  ),
});

export const MonthlySpendingProgressCard = (props: Props) => {
  const { year, month, isMobile, costList, monthlyBudget } = props;
  const today = new Date();
  const daysInMonth = new Date(year, month, 0).getDate();
  const selectedMonthKey = year * 12 + month;
  const currentMonthKey = today.getFullYear() * 12 + today.getMonth() + 1;
  const isCurrentMonth = selectedMonthKey === currentMonthKey;
  const isPastMonth = selectedMonthKey < currentMonthKey;
  const reportingDay = isCurrentMonth
    ? Math.min(today.getDate(), daysInMonth)
    : isPastMonth
      ? daysInMonth
      : 0;

  const dailyCosts = useMemo(() => {
    const costs = new Array<number>(daysInMonth).fill(0);

    costList.forEach((item) => {
      if (item.type !== SpendingType.Outcome) return;

      const date = new Date(item.date);
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month) {
        return;
      }

      costs[date.getDate() - 1] += Number(item.amount);
    });

    return costs;
  }, [costList, daysInMonth, month, year]);

  const chartData = useMemo<SpendingProgressPoint[]>(() => {
    let cumulative = 0;

    return dailyCosts.map((daily, index) => {
      const day = index + 1;
      cumulative += daily;

      return {
        day,
        label: `${month}/${day}`,
        daily,
        actual: day <= reportingDay ? cumulative : null,
        budget:
          monthlyBudget > 0
            ? Math.round((monthlyBudget * day) / daysInMonth)
            : null,
      };
    });
  }, [dailyCosts, daysInMonth, month, monthlyBudget, reportingDay]);

  const spentToDate = dailyCosts
    .slice(0, reportingDay)
    .reduce((sum, amount) => sum + amount, 0);
  const projectedTotal =
    isCurrentMonth && reportingDay > 0
      ? Math.round((spentToDate / reportingDay) * daysInMonth)
      : isPastMonth
        ? spentToDate
        : 0;

  if (monthlyBudget <= 0) {
    const endDay = reportingDay || Math.min(7, daysInMonth);
    const startDay = Math.max(1, endDay - 6);
    const recentData = chartData.slice(startDay - 1, endDay);
    const recentTotal = recentData.reduce((sum, point) => sum + point.daily, 0);

    return (
      <ProgressCardShell
        title={isCurrentMonth ? '近 7 日花費' : `${month} 月近 7 日花費`}
        summaryLabel="合計"
        summaryValue={recentTotal}
      >
        <SpendingProgressChart
          data={recentData}
          isMobile={isMobile}
          mode="recent"
        />
        <p className="mt-2 text-xs text-gray-400">
          設定月預算後，即可查看消費速度與預算進度。
        </p>
      </ProgressCardShell>
    );
  }

  const difference = monthlyBudget - projectedTotal;
  const isOverBudget = difference < 0;
  const statusPrefix = isCurrentMonth ? '預計' : '';
  const statusText =
    reportingDay === 0
      ? '尚未開始'
      : difference === 0
        ? `${statusPrefix}符合預算`
        : `${statusPrefix}${isOverBudget ? '超出' : '低於'}預算 $${normalizeNumber(Math.abs(difference))}`;

  return (
    <ProgressCardShell
      title={isCurrentMonth ? '本月花費進度' : `${month} 月花費進度`}
      summaryLabel={
        reportingDay === 0 ? '月預算' : isCurrentMonth ? '預估月底' : '總花費'
      }
      summaryValue={reportingDay === 0 ? monthlyBudget : projectedTotal}
    >
      <SpendingProgressChart
        data={chartData}
        isMobile={isMobile}
        mode="budget"
        reportingDay={isCurrentMonth ? reportingDay : undefined}
      />

      <div className="mt-2 flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="bg-primary-500 h-0.5 w-4 rounded-full" />
            累積花費
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t border-dashed border-gray-500" />
            預算進度
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            reportingDay === 0
              ? 'bg-gray-800 text-gray-400'
              : isOverBudget
                ? 'bg-red-50 text-[var(--color-expense)]'
                : 'bg-income-50 text-income-500'
          }`}
        >
          {statusText}
        </span>
      </div>
    </ProgressCardShell>
  );
};

const ProgressCardShell = ({
  title,
  summaryLabel,
  summaryValue,
  children,
}: {
  title: string;
  summaryLabel: string;
  summaryValue: number;
  children: React.ReactNode;
}) => (
  <section
    className="relative flex w-full flex-col items-start rounded-2xl border border-black/[0.08] bg-gray-950 p-5 text-gray-300 backdrop-blur-sm md:min-w-110"
    aria-label={title}
  >
    <div className="flex w-full items-baseline justify-between gap-3">
      <span className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 uppercase">
        {title}
      </span>
      <p
        className="text-right text-[11px] font-medium text-gray-400"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {summaryLabel}{' '}
        <span className="font-semibold text-gray-200">
          ${normalizeNumber(summaryValue)}
        </span>
      </p>
    </div>

    <div className="w-full pt-3">{children}</div>
  </section>
);
