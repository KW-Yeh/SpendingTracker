"use client";

import { ROUTE_TITLE } from "@/utils/constants";
import { usePathname } from "next/navigation";

export const RouteTitle = () => {
  const pathName = usePathname();
  return <h1 className="text-xl font-bold">{ROUTE_TITLE[pathName]}</h1>;
};
