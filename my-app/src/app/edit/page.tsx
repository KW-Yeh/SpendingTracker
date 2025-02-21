import EditRecordModal from '@/composites/EditRecordModal';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { id } = await searchParams;
  return <EditRecordModal recordId={id} />;
}
