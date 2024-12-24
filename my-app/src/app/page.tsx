import { SpendingInfoSection } from '@/composites/SpendingInfoSection';
import { SpendingProvider } from '@/context/SpendingProvider';

export default function Home() {
  return (
    <div className="flex w-full flex-1">
      <SpendingProvider>
        <SpendingInfoSection />
      </SpendingProvider>
    </div>
  );
}
