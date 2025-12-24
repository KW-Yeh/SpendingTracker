import { Dashboard } from '@/app/group/Dashboard';
import { PageTitle } from '@/components/PageTitle';

export default function Home() {
  return (
    <div className="bg-soft relative flex w-full flex-1 flex-col">
      <PageTitle>帳本管理</PageTitle>
      <Dashboard />
    </div>
  );
}
