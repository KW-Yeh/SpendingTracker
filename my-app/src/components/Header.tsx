import { Account } from "@/components/Account";

export const Header = () => {
  return (
    <div className="fixed w-full left-0 top-0 z-40 p-6 shadow backdrop-blur">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">追蹤收支</div>
        <Account />
      </div>
    </div>
  );
};
