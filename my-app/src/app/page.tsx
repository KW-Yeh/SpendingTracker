import { PageTitle } from '@/components/PageTitle';
import { MENU_CONFIG, Route } from '@/utils/constants';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col flex-wrap items-center gap-4 p-4">
      <PageTitle>歡迎使用記帳追蹤</PageTitle>
      <div className="flex flex-wrap justify-center gap-2">
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
    </div>
  );
}

const RouteCard = ({ href, desc }: { href: string; desc: string }) => {
  return (
    <Link
      key={href}
      href={href}
      className="flex w-80 flex-col items-center rounded-xl border border-solid border-gray-300 bg-background p-2 shadow-lg shadow-transparent transition-all active:shadow-primary-100 sm:hover:shadow-primary-100"
    >
      <h3 className="my-4 text-lg font-bold sm:text-xl">{MENU_CONFIG[href]}</h3>
      <p className="mb-4 text-balance px-2 text-center text-sm text-gray-500">
        {desc}
      </p>
    </Link>
  );
};
