'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useGroupCtx } from '@/context/UserGroupProvider';
import { putGroup, putUser } from '@/services/dbHandler';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';

export const Dashboard = () => {
  const { myGroups, config, syncUser } = useUserConfigCtx();
  const { syncGroup, loading } = useGroupCtx();

  const handleCreateGroup = useCallback(async () => {
    if (!config) return;
    const groupName = prompt('請輸入身分群組名稱');
    if (!groupName) return;
    const groupId = uuid();
    await putGroup({
      id: groupId,
      name: groupName,
      users: [
        {
          name: config.name,
          email: config.email,
          image: config.image,
        },
      ],
    });
    syncGroup();
    await putUser({
      ...config,
      groups: [...config.groups, groupId],
    });
    syncUser();
  }, [config, syncGroup, syncUser]);

  return (
    <div className="flex w-full flex-col items-center gap-4 text-sm sm:text-base">
      <div className="flex w-full items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleCreateGroup}
          className="flex items-center rounded-md bg-primary-100 px-4 py-2 transition-colors active:bg-primary-300 sm:hover:bg-primary-300"
        >
          <PlusIcon className="mr-2 size-4" />
          <span className="font-semibold">建立群組</span>
        </button>
        <button
          type="button"
          onClick={() => syncGroup()}
          disabled={loading}
          className="rounded-md bg-gray-300 p-2 transition-colors active:bg-gray-400 sm:hover:bg-gray-400"
        >
          <RefreshIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
        {myGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

const GroupCard = ({ group }: { group: Group }) => {
  const [loading] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'invite':
        const inviteLink = `${location.href}/invite/${group.id}`;
        navigator.clipboard.writeText(inviteLink).then(() => {
          alert(`已複製邀請連結: ${inviteLink}`);
        });
        break;
      case 'edit':
        alert('尚無編輯功能');
        break;
      case 'delete':
        if (!confirm('確定要刪除此群組嗎?（尚無功能）')) return;
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="relative grid w-full max-w-[350px] grid-cols-12 gap-4 rounded-xl border border-solid p-4 border-gray-300"
    >
      <div
        className={`absolute bottom-0 left-0 right-0 top-0 animate-pulse rounded-xl border border-solid border-transparent bg-gray-500/50 ${loading ? 'visible' : 'invisible'}`}
      ></div>
      <div className="col-span-10 flex flex-col justify-between gap-2">
        <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold sm:text-lg">
          {group.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span>成員:</span>
          {group.users.map((user) => (
            <Image
              key={user.email}
              src={user.image}
              alt={user.name}
              title={user.name}
              width={20}
              height={20}
              className="size-5 rounded-full"
            />
          ))}
        </div>
      </div>
      <div className="col-span-2 flex flex-col items-end justify-between gap-4">
        <ActionMenu
          onClick={handleAction}
          options={[
            {
              value: 'invite',
              label: (
                <>
                  <LinkIcon className="size-4" />
                  <span>邀請</span>
                </>
              ),
            },
            {
              value: 'edit',
              label: (
                <>
                  <EditIcon className="size-4" />
                  <span>編輯</span>
                </>
              ),
            },
            {
              value: 'delete',
              label: (
                <>
                  <DeleteIcon className="size-4" />
                  <span>刪除</span>
                </>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
