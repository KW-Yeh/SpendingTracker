import { PrefetchRoute } from '@/components/PrefetchRoute';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { userAgent } from 'next/server';
import { CollaborateSection } from './CollaborateSection';

export const metadata: Metadata = {
  title: '協作記帳',
  description: '多人共同記帳',
  authors: { name: 'KW' },
  openGraph: {
    title: '協作記帳',
    description: '多人共同記帳',
    url: 'https://gs-db.vercel.app/collaborate',
    images: [
      {
        url: '/Spending-512.png',
        width: 512,
        height: 512,
      },
    ],
  },
};

export default async function CollaboratePage() {
  const { device } = userAgent({ headers: await headers() });
  return (
    <div className="bg-soft relative flex w-full flex-1">
      <PrefetchRoute />
      <CollaborateSection isMobile={device.type === 'mobile'} />
    </div>
  );
}
