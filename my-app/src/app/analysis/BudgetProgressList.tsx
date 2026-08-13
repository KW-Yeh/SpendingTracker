import { ChartContainer } from '@/app/analysis/ChartContainer';
import { normalizeNumber } from '@/utils/normalizeNumber';

export const BudgetProgressList = ({
  items,
}: {
  items: AnalysisBudgetProgress[];
}) => (
  <ChartContainer
    title="各類別預算進度"
    subtitle="優先顯示超支與接近上限的類別；進度超過 100% 時保留實際超支幅度。"
  >
    <div className="w-full" data-testid="budget-progress-list">
      {items.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl bg-gray-800 text-sm text-gray-400">
          尚未設定類別預算
        </div>
      ) : (
        <ul className="space-y-5">
          {items.map((item) => {
            const width = Math.min(item.usagePercent, 100);
            const isWarning = !item.isOver && item.usagePercent >= 80;
            return (
              <li
                key={item.category}
                data-budget-status={item.isOver ? 'over' : 'within'}
              >
                <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <strong className="block truncate text-gray-100">
                      {item.category} {item.label}
                    </strong>
                    <span className="text-xs text-gray-400">
                      ${normalizeNumber(item.spent)} / $
                      {normalizeNumber(item.budgeted)}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <strong
                      className={`block tabular-nums ${
                        item.isOver
                          ? 'text-[var(--color-expense)]'
                          : isWarning
                            ? 'text-[var(--color-warning)]'
                            : 'text-primary-500'
                      }`}
                    >
                      {item.usagePercent.toFixed(0)}%
                    </strong>
                    <span className="text-xs text-gray-400">
                      {item.isOver ? '超支' : '剩餘'} $
                      {normalizeNumber(Math.abs(item.remaining))}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${
                      item.isOver
                        ? 'bg-[var(--color-expense)]'
                        : isWarning
                          ? 'bg-[var(--color-warning)]'
                          : 'bg-primary-500'
                    }`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </ChartContainer>
);
