import { normalizeNumber } from '@/utils/normalizeNumber';

const formatMoney = (value: number) =>
  `${value < 0 ? '-' : ''}$${normalizeNumber(Math.abs(value))}`;

export const AnalysisKpiGrid = ({ data }: { data: AnalysisDashboardData }) => {
  const { summary } = data;
  const change = summary.previousChangePercent;
  const usage = summary.budgetUsagePercent;

  const cards = [
    {
      label: '本月支出',
      value: formatMoney(summary.outcome),
      detail: data.selectedMonthLabel,
      tone: 'text-[var(--color-expense)]',
    },
    {
      label: '較上月',
      value:
        change === null
          ? '無可比資料'
          : `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
      detail:
        summary.previousDelta === 0
          ? '與上月持平'
          : `${summary.previousDelta > 0 ? '多花' : '少花'} ${formatMoney(Math.abs(summary.previousDelta))}`,
      tone:
        summary.previousDelta > 0
          ? 'text-[var(--color-expense)]'
          : 'text-[var(--color-income)]',
    },
    {
      label: '本月結餘',
      value: formatMoney(summary.net),
      detail: `收入 ${formatMoney(summary.income)}`,
      tone:
        summary.net >= 0
          ? 'text-[var(--color-income)]'
          : 'text-[var(--color-expense)]',
    },
    {
      label: '預算使用率',
      value: usage === null ? '尚未設定' : `${usage.toFixed(1)}%`,
      detail:
        usage === null
          ? '設定預算後即可追蹤'
          : `預算 ${formatMoney(summary.budgeted)}`,
      tone:
        usage !== null && usage > 100
          ? 'text-[var(--color-expense)]'
          : 'text-primary-500',
    },
  ];

  return (
    <section
      aria-label="本月消費摘要"
      className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="card flex min-h-32 flex-col justify-between !p-4 sm:!p-5"
        >
          <span className="text-xs font-semibold tracking-wide text-gray-400">
            {card.label}
          </span>
          <div className="mt-4 min-w-0">
            <strong
              className={`block truncate text-xl font-semibold tabular-nums sm:text-2xl ${card.tone}`}
            >
              {card.value}
            </strong>
            <span className="mt-1 block truncate text-xs text-gray-400">
              {card.detail}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
};
