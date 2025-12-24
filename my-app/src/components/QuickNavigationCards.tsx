'use client';

import { CoinIcon } from '@/components/icons/CoinIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { ListIcon } from '@/components/icons/ListIcon';
import Link from 'next/link';

const NAVIGATION_CARDS = [
  {
    title: '記帳',
    description: '快速新增收支記錄',
    href: '/transactions',
    icon: EditIcon,
    gradient: 'from-purple-400 to-pink-300',
  },
  {
    title: '新增支出',
    description: '詳細支出項目登記',
    href: '/edit',
    icon: CoinIcon,
    gradient: 'from-primary-400 to-primary-600',
  },
  {
    title: '分析消費',
    description: '查看消費統計圖表',
    href: '/analysis',
    icon: ListIcon,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    title: '預算規劃',
    description: '設定與管理預算',
    href: '/budget',
    icon: CoinIcon,
    gradient: 'from-green-400 to-emerald-500',
  },
];

export const QuickNavigationCards = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:w-1/2">
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
