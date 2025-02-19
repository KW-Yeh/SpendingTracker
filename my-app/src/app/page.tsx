import { redirect, RedirectType } from 'next/navigation';

export default function Home() {
  redirect('/insert?quickInsert=true', RedirectType.replace);
  // return (
  //   <div className="flex w-full flex-1 flex-col flex-wrap items-center gap-4 p-4">
  //     <PageTitle>歡迎使用記帳追蹤</PageTitle>
  //     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  //       <RouteCard
  //         href={Route.Insert}
  //         banner={InsertBanner}
  //         desc="記下你的生活點滴、保留你的歷史足跡。記帳將成為你生命中不可分割的一部份。"
  //       />
  //       <RouteCard
  //         href={Route.Group}
  //         banner={GroupBanner}
  //         desc="獨樂樂不如眾樂樂，偷偷觀察對方的生活細節往往能夠發現他是如何地揮霍而不自知。"
  //       />
  //       <RouteCard
  //         href={Route.List}
  //         banner={AnalysisBanner}
  //         desc="復盤的重要性你我皆知，校正回歸能快速最佳化你的策略，最終財富自由指日可待。"
  //       />
  //       <RouteCard
  //         href={Route.Budget}
  //         banner={PlanBanner}
  //         desc="自律地規劃儲蓄目標，未雨綢繆不是杞人憂天。健康的資產配置讓你生活更有保障。"
  //       />
  //     </div>
  //   </div>
  // );
}

// const RouteCard = ({
//   banner,
//   href,
//   desc,
// }: {
//   banner: StaticImageData;
//   href: string;
//   desc: string;
// }) => {
//   return (
//     <Link
//       key={href}
//       href={href}
//       className="group flex w-72 flex-col items-center rounded-xl border border-solid border-gray-300 bg-background p-2 shadow-md hover:shadow-lg"
//     >
//       <div className="w-full overflow-hidden rounded">
//         <Image
//           src={banner}
//           width="80"
//           height="100"
//           alt="banner"
//           className="aspect-video w-full rounded transition-all duration-500 group-hover:scale-125"
//         />
//       </div>
//       <h3 className="my-4 text-lg font-bold transition-colors group-hover:text-primary-500 sm:text-xl">
//         {MENU_CONFIG[href]}
//       </h3>
//       <p className="mb-4 text-balance px-2 text-center text-sm text-gray-500">
//         {desc}
//       </p>
//     </Link>
//   );
// };
