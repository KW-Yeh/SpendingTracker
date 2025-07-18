'use client';

import { CATEGORY_WORDING_MAP } from '@/utils/constants';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useState } from 'react';
import { BiCalendar, BiEdit, BiTrash } from 'react-icons/bi';

interface BudgetCardProps {
  item: BudgetItem;
  onEdit: (item: BudgetItem) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard = ({ item, onEdit, onDelete }: BudgetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIconForCategory = (category: string) => {
    // Find the emoji that matches the category name
    const entry = Object.entries(CATEGORY_WORDING_MAP).find(
      ([, value]) => value === category,
    );
    return entry ? entry[0] : '✨'; // Default to sparkles if not found
  };

  const categoryIcon = getIconForCategory(item.category);

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (percentage < 80)
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  const spentPercentage =
    item.amount > 0 ? (item.spent / item.amount) * 100 : 0;
  const progressColor = getProgressColor(spentPercentage);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header with gradient background */}
      <div className="from-primary-50 to-primary-100 bg-gradient-to-r p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="text-primary-600 flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
              {/* Render the icon directly */}
              {getCategoryIcon(categoryIcon, 'size-5') || categoryIcon}
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              {item.category}
            </h3>
          </div>

          {/* Action buttons */}
          <div
            className={`flex gap-1 transition-all ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="hover:bg-primary-50 hover:text-primary-600 rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors"
              aria-label="編輯"
            >
              <BiEdit className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="刪除"
            >
              <BiTrash className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Budget Amount */}
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-gray-500">預算金額</span>
          <span className="text-xl font-semibold text-gray-800">
            ${normalizeNumber(item.amount)}
          </span>
        </div>

        {/* Spent Amount */}
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-gray-500">已使用</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-medium text-gray-700">
              ${normalizeNumber(item.spent)}
            </span>
            <span
              className={`text-sm ${
                spentPercentage < 50
                  ? 'text-green-600'
                  : spentPercentage < 80
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              ({spentPercentage.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full ${progressColor} transition-all`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          ></div>
        </div>

        {/* Remaining Amount */}
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-sm text-gray-500">剩餘預算</span>
          <span className="text-primary-600 text-base font-medium">
            ${normalizeNumber(Math.max(0, item.amount - item.spent))}
          </span>
        </div>

        {/* Footer Info */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <BiCalendar className="size-4 text-gray-400" />
            <span>{item.period}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
