'use client';

import { BarChartIcon } from '@/components/icons/BarChartIcon';
import { CoinIcon } from '@/components/icons/CoinIcon';
import { ListTaskIcon } from '@/components/icons/ListTaskIcon';
import Link from 'next/link';
import { PlusIcon } from './icons/PlusIcon';

const NAVIGATION_CARDS = [
  {
    title: '帳目編輯',
    description: '詳細收支記錄',
    href: '/transactions',
    icon: ListTaskIcon,
    gradient: 'from-purple-400 to-pink-300',
  },
  {
    title: '帳目新增',
    description: '新增收支項目',
    href: '/edit',
    icon: PlusIcon,
    gradient: 'from-primary-400 to-primary-600',
  },
  {
    title: '帳目分析',
    description: '查看消費統計圖表',
    href: '/analysis',
    icon: BarChartIcon,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    title: '預算管理',
    description: '設定與管理預算',
    href: '/budget',
    icon: CoinIcon,
    gradient: 'from-green-400 to-emerald-500',
  },
];

export const QuickNavigationCards = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:min-w-110">
      {NAVIGATION_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="bg-background group relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow active:scale-100"
          >
            <div
              className={`flex items-center justify-center rounded-full bg-gradient-to-r ${card.gradient} p-3`}
            >
              <Icon className="size-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-700">{card.title}</h3>
            <p className="text-center text-xs text-gray-500">
              {card.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
