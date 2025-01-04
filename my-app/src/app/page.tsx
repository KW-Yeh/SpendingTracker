import { MENU_CONFIG, Route } from '@/utils/constants';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col flex-wrap items-center gap-4 p-4 sm:flex-row sm:items-start sm:justify-center">
      <h2 className="w-full text-center text-base">
        歡迎來到消費追蹤網站，你可以從
        <span className="font-semibold">記帳</span>
        開始
      </h2>
      <RouteCard
        href={Route.Insert}
        desc="記下你的生活點滴、保留你的歷史足跡。記帳將成為你生命中不可分割的一部份。"
      />
      <RouteCard
        href={Route.Group}
        desc="獨樂樂不如眾樂樂，偷偷觀察對方的生活細節往往能夠發現他是如何地揮霍而不自知。"
      />
      <RouteCard
        href={Route.List}
        desc="復盤的重要性你我皆知，校正回歸能快速最佳化你的策略，最終財富自由指日可待。"
      />
      <RouteCard
        href={Route.Budget}
        desc="自律地規劃儲蓄目標，未雨綢繆不是杞人憂天。健康的資產配置讓你生活更有保障。"
      />
    </div>
  );
}

const RouteCard = ({ href, desc }: { href: string; desc: string }) => {
  return (
    <div
      key={href}
      className="flex w-full max-w-80 flex-col items-center rounded-xl border border-solid border-gray-300 bg-background p-4"
    >
      <h3 className="my-4 text-lg font-bold sm:text-xl">{MENU_CONFIG[href]}</h3>
      <p className="mb-4 text-balance px-2 text-center text-sm text-gray-500">
        {desc}
      </p>
      <Link
        href={href}
        type="button"
        className="rounded-md bg-primary-100 px-8 py-2 text-center text-base transition-colors active:bg-primary-300 sm:hover:bg-primary-300"
      >
        立即前往
      </Link>
    </div>
  );
};
