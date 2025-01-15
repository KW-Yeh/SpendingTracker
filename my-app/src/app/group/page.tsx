import { Dashboard } from '@/app/group/Dashboard';
import { PrepareData } from '@/composites/PrepareData';

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col p-6">
      <PrepareData />
      <Dashboard />
    </div>
  );
}
