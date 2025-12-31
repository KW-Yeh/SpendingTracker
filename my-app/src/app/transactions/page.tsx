import { SpendingInfoSection } from '@/app/transactions/SpendingInfoSection';
import { PageTitle } from '@/components/PageTitle';
import { PrefetchRoute } from '@/components/PrefetchRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '消費追蹤',
  description: '幫助記賬',
  authors: { name: 'KW' },
  openGraph: {
    title: '消費追蹤',
    description: '幫助記賬',
    url: 'https://gs-db.vercel.app/transactions',
    images: [
      {
        url: '/Spending-512.png',
        width: 512,
        height: 512,
      },
    ],
  },
};

export default async function Home() {
  return (
    <div className="bg-soft relative flex w-full flex-1 flex-col">
      <PageTitle>帳目管理</PageTitle>
      <PrefetchRoute />
      <SpendingInfoSection />
    </div>
  );
}
