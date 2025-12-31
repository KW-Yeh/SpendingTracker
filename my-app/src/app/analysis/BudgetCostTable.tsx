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
  const { totalBudgeted, totalSpent, totalNecessary, totalUnnecessary, categoryBreakdown } = props;

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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="bg-primary-500/30 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-700">預算總覽</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">總預算</span>
            <span className="text-base font-semibold text-gray-800">
              ${normalizeNumber(totalBudgeted)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">已使用</span>
            <span
              className={`text-base font-semibold ${
                totalSpent > totalBudgeted ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              ${normalizeNumber(totalSpent)} ({overallUsagePercent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">剩餘預算</span>
            <span
              className={`text-base font-semibold ${
                totalSpent > totalBudgeted ? 'text-red-600' : 'text-green-600'
              }`}
            >
              ${normalizeNumber(Math.max(0, totalBudgeted - totalSpent))}
            </span>
          </div>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="bg-orange-500/30 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-700">支出結構分析</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">必要支出</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-orange-600">
                ${normalizeNumber(totalNecessary)}
              </span>
              <span className="text-xs text-gray-500">({necessaryPercent.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">額外支出</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-700">
                ${normalizeNumber(totalUnnecessary)}
              </span>
              <span className="text-xs text-gray-500">({unnecessaryPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="bg-blue-500/30 px-4 py-3">
            <h3 className="text-sm font-bold text-gray-700">各類別預算使用情況</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">類別</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">預算</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">已用</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">必要</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">額外</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoryBreakdown.map((item) => {
                  const usagePercent =
                    item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
                  const isOver = item.spent > item.budgeted;

                  return (
                    <tr key={item.category} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-700">{item.category}</td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        ${normalizeNumber(item.budgeted)}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-semibold ${
                          isOver ? 'text-red-600' : 'text-gray-700'
                        }`}
                      >
                        ${normalizeNumber(item.spent)}
                        <span className="ml-1 text-xs">({usagePercent.toFixed(0)}%)</span>
                      </td>
                      <td className="px-4 py-2 text-right text-orange-600">
                        ${normalizeNumber(item.necessary)}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600">
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
