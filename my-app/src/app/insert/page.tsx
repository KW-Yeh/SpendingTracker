import { SpendingInfoSection } from '@/app/insert/SpendingInfoSection';
import { PrepareData } from '@/composites/PrepareData';

export default function Home() {
  return (
    <div className="flex w-full flex-1">
      <PrepareData />
      <SpendingInfoSection />
    </div>
  );
}
