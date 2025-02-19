import { Chooser } from '@/app/choose/chooser';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '選擇困難嗎?',
  description: '幫你釐清想法並抉擇吧!',
  authors: { name: 'KW' },
};

export default function Home() {
  return (
    <div className="flex w-full flex-1">
      <Chooser />
    </div>
  );
}
