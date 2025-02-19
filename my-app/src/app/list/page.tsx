import { ChartBlock } from '@/app/list/ChartBlock';
import { PrepareData } from '@/composites/PrepareData';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '分析消費',
  description: '幫助分析花費',
  authors: { name: 'KW' },
};

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col items-center p-4">
      <PrepareData />
      <ChartBlock />
    </div>
  );
}
