import EditRecordModal from "@/composites/EditRecordModal";

export default async function Page({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;
  return <EditRecordModal recordId={recordId} />;
}
