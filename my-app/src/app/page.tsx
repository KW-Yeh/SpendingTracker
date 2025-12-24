import { DashboardSection } from '@/app/DashboardSection';
import { PrefetchRoute } from '@/components/PrefetchRoute';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { userAgent } from 'next/server';

export const metadata: Metadata = {
  title: '首頁 - 消費追蹤',
  description: '查看消費概況和快速導航',
};

export default async function Home() {
  const { device } = userAgent({ headers: await headers() });
  return (
    <div className="bg-soft relative flex w-full flex-1 flex-col">
      <PrefetchRoute />
      <DashboardSection isMobile={device.type === 'mobile'} />
    </div>
  );
}
