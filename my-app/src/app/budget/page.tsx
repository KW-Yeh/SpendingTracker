import { BudgetList } from '@/app/budget/BudgetList';

export default async function BudgetPage() {
  return (
    <div className="bg-soft relative flex w-full flex-1">
      <div className="content-wrapper">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          預算管理
        </h1>
        <p className="mt-2 text-gray-600">設定和追蹤您的預算，掌握財務狀況</p>

        <BudgetList />
      </div>
    </div>
  );
}
