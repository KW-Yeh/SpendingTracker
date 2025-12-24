import { ChartBlock } from '@/app/analysis/ChartBlock';
import { PageTitle } from '@/components/PageTitle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '分析消費',
  description: '幫助分析花費',
  authors: { name: 'KW' },
  openGraph: {
    title: '分析消費',
    description: '幫助分析花費',
    url: 'https://gs-db.vercel.app/analysis',
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
    <div className="bg-soft relative flex w-full flex-1 flex-col">
      <PageTitle>消費分析</PageTitle>
      <ChartBlock />
    </div>
  );
}
