import { SpendingInfoSection } from "@/components/SpendingInfoSection";
import { SpendingInfoProvider } from "@/context/SpendingInfoProvider";

export default function Home() {
  return (
    <div className="w-full flex-1 max-w-96 mx-auto flex flex-col gap-6">
      <SpendingInfoProvider>
        <SpendingInfoSection />
      </SpendingInfoProvider>
    </div>
  );
}
