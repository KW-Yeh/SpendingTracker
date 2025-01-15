import { InviteConfirm } from '@/app/group/invite/[id]/InviteConfirm';
import { PageTitle } from '@/components/PageTitle';

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col items-center p-6">
      <PageTitle>邀請加入群組</PageTitle>
      <InviteConfirm />
    </div>
  );
}
