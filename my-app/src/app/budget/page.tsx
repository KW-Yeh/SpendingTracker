import { MonthlyBudgetTemplate } from '@/app/budget/MonthlyBudgetTemplate';
import { TabSwitch } from '@/app/budget/TabSwitch';
import { YearlyBudgetTemplate } from '@/app/budget/YearlyBudgetTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '消費預算',
  description: '預算安排',
  authors: { name: 'KW' },
  openGraph: {
    title: '消費預算',
    description: '預算安排',
    url: 'https://gs-db.vercel.app/budget',
    images: [
      {
        url: '/Spending-512.png',
        width: 512,
        height: 512,
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col items-center px-2 sm:px-8">
      <h2 className="bg-background my-10 text-lg font-semibold sm:text-xl">
        編列預算工具
      </h2>
      <TabSwitch
        config={[
          {
            tabName: '年度預算',
            template: <YearlyBudgetTemplate />,
          },
          {
            tabName: '每月預算',
            template: <MonthlyBudgetTemplate />,
          },
        ]}
      />
    </div>
  );
}
