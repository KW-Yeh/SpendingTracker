import { InviteConfirm } from '@/app/group/invite/[id]/InviteConfirm';

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col p-6">
      <InviteConfirm />
    </div>
  );
}
