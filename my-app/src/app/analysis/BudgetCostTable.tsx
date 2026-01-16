'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { useMemo } from 'react';

interface Props {
  totalBudgeted: number;
  totalSpent: number;
  totalNecessary: number;
  totalUnnecessary: number;
  categoryBreakdown: {
    category: string;
    budgeted: number;
    spent: number;
    necessary: number;
    unnecessary: number;
  }[];
}

const BudgetCostTable = (props: Props) => {
  const {
    totalBudgeted,
    totalSpent,
    totalNecessary,
    totalUnnecessary,
    categoryBreakdown,
  } = props;

  const overallUsagePercent = useMemo(
    () => (totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0),
    [totalBudgeted, totalSpent],
  );

  const necessaryPercent = useMemo(
    () => (totalSpent > 0 ? (totalNecessary / totalSpent) * 100 : 0),
    [totalNecessary, totalSpent],
  );

  const unnecessaryPercent = useMemo(
    () => (totalSpent > 0 ? (totalUnnecessary / totalSpent) * 100 : 0),
    [totalUnnecessary, totalSpent],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Overall Summary */}
      <div className="overflow-hidden rounded-lg border border-gray-600 bg-gray-800/90 shadow-sm backdrop-blur-sm">
        <div className="bg-primary-500/20 border-b border-gray-600 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-200">預算總覽</h3>
        </div>
        <div className="divide-y divide-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">總預算</span>
            <span className="text-base font-semibold text-gray-200">
              ${normalizeNumber(totalBudgeted)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">已使用</span>
            <span
              className={`text-base font-semibold ${
                totalSpent > totalBudgeted
                  ? 'text-secondary-400'
                  : 'text-gray-200'
              }`}
            >
              ${normalizeNumber(totalSpent)} ({overallUsagePercent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">剩餘預算</span>
            <span
              className={`text-base font-semibold ${
                totalSpent > totalBudgeted
                  ? 'text-secondary-400'
                  : 'text-income-400'
              }`}
            >
              ${normalizeNumber(Math.max(0, totalBudgeted - totalSpent))}
            </span>
          </div>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="overflow-hidden rounded-lg border border-gray-600 bg-gray-800/90 shadow-sm backdrop-blur-sm">
        <div className="border-b border-gray-600 bg-orange-500/20 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-200">支出結構分析</h3>
        </div>
        <div className="divide-y divide-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">必要支出</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-orange-400">
                ${normalizeNumber(totalNecessary)}
              </span>
              <span className="text-xs text-gray-500">
                ({necessaryPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-400">額外支出</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-300">
                ${normalizeNumber(totalUnnecessary)}
              </span>
              <span className="text-xs text-gray-500">
                ({unnecessaryPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-600 bg-gray-800/90 shadow-sm backdrop-blur-sm">
          <div className="bg-accent-500/20 border-b border-gray-600 px-4 py-3">
            <h3 className="text-sm font-bold text-gray-200">
              各類別預算使用情況
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800/95 backdrop-blur-sm">
                <tr className="border-b border-gray-600">
                  <th className="px-4 py-2 text-left font-semibold text-gray-300">
                    類別
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-300">
                    預算
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-300">
                    已用
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-300">
                    必要
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-300">
                    額外
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {categoryBreakdown.map((item) => {
                  const usagePercent =
                    item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
                  const isOver = item.spent > item.budgeted;

                  return (
                    <tr
                      key={item.category}
                      className="transition-colors hover:bg-gray-700/50"
                    >
                      <td className="px-4 py-2 font-medium text-gray-300">
                        {item.category}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        ${normalizeNumber(item.budgeted)}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-semibold ${
                          isOver ? 'text-secondary-400' : 'text-gray-300'
                        }`}
                      >
                        ${normalizeNumber(item.spent)}
                        <span className="ml-1 text-xs">
                          ({usagePercent.toFixed(0)}%)
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right text-orange-400">
                        ${normalizeNumber(item.necessary)}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        ${normalizeNumber(item.unnecessary)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCostTable;
