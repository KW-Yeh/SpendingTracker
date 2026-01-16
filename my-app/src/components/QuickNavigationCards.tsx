'use client';

import { BarChartIcon } from '@/components/icons/BarChartIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { CoinIcon } from '@/components/icons/CoinIcon';
import { ListTaskIcon } from '@/components/icons/ListTaskIcon';
import Link from 'next/link';

const NAVIGATION_CARDS = [
  {
    title: '帳目編輯',
    description: '詳細收支記錄',
    href: '/transactions',
    icon: ListTaskIcon,
    gradient: 'from-primary-400 to-secondary-400',
  },
  {
    title: '帳本管理',
    description: '管理帳本與成員',
    href: '/group',
    icon: BookIcon,
    gradient: 'from-secondary-400 to-secondary-600',
  },
  {
    title: '帳目分析',
    description: '查看消費統計圖表',
    href: '/analysis',
    icon: BarChartIcon,
    gradient: 'from-accent-400 to-accent-600',
  },
  {
    title: '預算管理',
    description: '設定與管理預算',
    href: '/budget',
    icon: CoinIcon,
    gradient: 'from-income-400 to-income-600',
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
            className="card group relative flex min-h-30 cursor-pointer flex-col items-center justify-center gap-3 p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          >
            <div
              className={`flex items-center justify-center rounded-2xl bg-linear-to-r ${card.gradient} p-4 shadow-lg transition-all duration-200 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]`}
            >
              <Icon className="size-7 text-white" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3
                className="text-sm font-bold text-gray-100"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {card.title}
              </h3>
              <p className="text-center text-xs text-gray-400">
                {card.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
