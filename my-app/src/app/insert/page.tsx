import { SpendingInfoSection } from '@/app/insert/SpendingInfoSection';
import { PrefetchRoute } from '@/components/PrefetchRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '消費追蹤',
  description: '幫助記賬',
  authors: { name: 'KW' },
  openGraph: {
    title: '消費追蹤',
    description: '幫助記賬',
    url: 'https://gs-db.vercel.app/insert',
    images: [
      {
        url: '/Spending-512.png',
        width: 512,
        height: 512,
      },
    ],
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const queryParams = await searchParams;
  return (
    <div className="flex w-full flex-1">
      <PrefetchRoute />
      <SpendingInfoSection quickInsert={queryParams.quickInsert} />
    </div>
  );
}
