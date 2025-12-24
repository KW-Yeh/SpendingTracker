import { BudgetList } from '@/app/budget/BudgetList';
import { PageTitle } from '@/components/PageTitle';

export default async function BudgetPage() {
  return (
    <div className="bg-soft relative flex w-full flex-1 flex-col">
      <PageTitle>預算管理</PageTitle>
      <BudgetList />
    </div>
  );
}
