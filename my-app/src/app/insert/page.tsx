import { SpendingInfoSection } from '@/app/insert/SpendingInfoSection';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const queryParams = await searchParams;
  return (
    <div className="flex w-full flex-1">
      <SpendingInfoSection quickInsert={queryParams.quickInsert} />
    </div>
  );
}
