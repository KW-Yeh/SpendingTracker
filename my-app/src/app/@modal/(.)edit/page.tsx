import EditRecordContainer from '@/composites/EditRecordContainer';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { id } = await searchParams;
  return <EditRecordContainer recordId={id} />;
}
