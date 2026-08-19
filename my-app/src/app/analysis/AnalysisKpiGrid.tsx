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
        usage === null
          ? 'text-gray-300'
          : usage > 100
            ? 'text-[var(--color-expense)]'
            : usage >= 80
              ? 'text-[var(--color-warning)]'
              : 'text-primary-500',
    },
  ];

  return (
    <section
      aria-label="本月消費摘要"
      className="grid w-full grid-cols-2 gap-2.5 lg:grid-cols-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="card flex min-h-26 flex-col justify-between !p-4"
        >
          <span className="text-[11px] font-semibold tracking-wide text-gray-400">
            {card.label}
          </span>
          <div className="mt-3 min-w-0">
            <strong
              className={`block truncate text-[22px] font-semibold tabular-nums ${card.tone}`}
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.025em',
              }}
            >
              {card.value}
            </strong>
            <span className="mt-0.5 block truncate text-[11px] text-gray-400">
              {card.detail}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
};
