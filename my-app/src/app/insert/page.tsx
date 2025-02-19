import { SpendingInfoSection } from '@/app/insert/SpendingInfoSection';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '消費追蹤',
  description: '幫助記賬跟分析花費',
  authors: { name: 'KW' },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const queryParams = await searchParams;
  return (
    <div className="flex w-full flex-1">
      <SpendingInfoSection quickInsert={queryParams.quickInsert} />
    </div>
  );
}
