import { Account } from "@/components/Account";

export const Header = () => {
  return (
    <div className="w-full sticky top-6 z-40 p-6 shadow backdrop-blur rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Spending Tracker</div>
        <Account />
      </div>
    </div>
  );
};
