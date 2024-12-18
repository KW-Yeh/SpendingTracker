"use client";

import { Account } from "@/composites/Account";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { CoinIcon } from "@/components/icons/CoinIcon";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { ListIcon } from "@/components/icons/ListIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { SettingIcon } from "@/components/icons/SettingIcon";
import useFocusRef from "@/hooks/useFocusRef";
import { ROUTE_TITLE } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export const MenuButton = () => {
  const asideRef = useFocusRef<HTMLElement>(() => {
    handleCloseAside();
  });

  function handleCloseAside() {
    requestAnimationFrame(() => {
      if (!asideRef.current) return;
      asideRef.current.style.left = "-240px";
    });
  }

  function handleOpenAside() {
    requestAnimationFrame(() => {
      if (!asideRef.current) return;
      asideRef.current.style.left = "0";
    });
  }

  return (
    <>
      <button
        onClick={handleOpenAside}
        className="size-8 rounded-full p-1 hover:bg-primary-100 transition-colors"
      >
        <MenuIcon className="size-full" />
      </button>
      <aside
        ref={asideRef}
        className="fixed w-60 -left-60 transition-all origin-right top-0 bottom-0 z-30 shadow-xl p-6 bg-background flex flex-col justify-between items-center"
      >
        <div className="w-full flex items-center mb-6">
          <button
            onClick={handleCloseAside}
            className="size-8 rounded-full p-2 hover:bg-gray-300 transition-colors"
          >
            <CloseIcon className="size-full" />
          </button>
        </div>
        <Account />
        <div className="w-full flex-1 flex flex-col items-center gap-2">
          {Object.keys(ROUTE_TITLE).map((path) => (
            <RouteButton
              key={path}
              href={path}
              label={ROUTE_TITLE[path]}
              onClick={handleCloseAside}
            />
          ))}
        </div>
        <button className="w-full text-left px-6 flex items-center py-3 font-semibold rounded-md transition-colors bg-gray-200 hover:bg-gray-300">
          <SettingIcon className="size-5 mr-3" />
          設定
        </button>
      </aside>
    </>
  );
};

const ROUTE_ICON: Record<string, ReactNode> = {
  "/": <HomeIcon className="size-5 mr-3" />,
  "/list": <ListIcon className="size-5 mr-3" />,
  "/budget": <CoinIcon className="size-5 mr-3" />,
};

const RouteButton = ({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) => {
  const pathName = usePathname();
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full text-left flex items-center font-semibold px-6 py-3 rounded-md transition-colors ${pathName === href ? "bg-primary-100" : "hover:bg-primary-300"}`}
    >
      {ROUTE_ICON[href]}
      {label}
    </Link>
  );
};
