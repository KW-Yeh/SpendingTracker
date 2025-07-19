'use client';

import { BudgetTemplateWithModal } from '@/app/budget/BudgetTemplateWithModal';

export default function BudgetPage() {
  return (
    <div className="bg-soft relative flex w-full flex-1 flex-col items-center px-4 py-6 sm:px-8">
      <div className="mb-6 w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">預算管理</h1>
        <p className="mt-2 text-gray-600">
          設定和追蹤您的預算，掌握財務狀況
        </p>
      </div>
      
      <div className="w-full max-w-6xl rounded-lg bg-white p-6 shadow-md sm:p-8">
        <BudgetTemplateWithModal />
      </div>
    </div>
  );
}
