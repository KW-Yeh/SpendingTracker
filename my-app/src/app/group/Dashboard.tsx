'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { Modal } from '@/components/Modal';
import { useGroupCtx } from '@/context/GroupProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { deleteGroup, putGroup } from '@/services/groupServices';
import { getUser, putUser } from '@/services/userServices';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { v7 as uuid } from 'uuid';

export const Dashboard = () => {
  const { config: userData, syncUser } = useUserConfigCtx();
  const { groups, syncGroup, loading } = useGroupCtx();

  const refresh = useCallback(() => {
    if (userData) {
      syncGroup(userData.groups);
    }
  }, [userData, syncGroup]);

  const handleCreateGroup = useCallback(async () => {
    if (!userData) return;
    const groupName = prompt('請輸入身分群組名稱');
    if (!groupName) return;
    const groupId = uuid();
    await putGroup({
      id: groupId,
      name: groupName,
      users: [
        {
          name: userData.name,
          email: userData.email,
          image: userData.image,
        },
      ],
    });
    await putUser({
      ...userData,
      groups: [...userData.groups, groupId],
    });
    syncGroup([...userData.groups, groupId]);
    syncUser();
  }, [userData, syncGroup, syncUser]);

  return (
    <div className="content-wrapper">
      <div className="flex w-full items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleCreateGroup}
          className="gradient-r-from-purple-to-blue flex items-center rounded-md px-4 py-2"
        >
          <PlusIcon className="mr-2 size-4" />
          <span>建立群組</span>
        </button>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center rounded-md px-4 py-2 text-gray-500 transition-colors hover:text-gray-700 active:text-gray-700"
        >
          <RefreshIcon
            className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`}
          />
          <span>刷新</span>
        </button>
      </div>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} refresh={refresh} />
        ))}
      </div>
    </div>
  );
};

const GroupCard = ({
  group,
  refresh,
}: {
  group: Group;
  refresh: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const inviteLink = `${location.origin}/group/invite/${group.id}`;
  const modalRef = useRef<ModalRef>(null);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('已複製邀請連結');
      modalRef.current?.close();
    });
  };

  const handleAction = async (action: string) => {
    switch (action) {
      case 'invite':
        modalRef.current?.open();
        break;
      case 'edit':
        alert('尚無編輯功能');
        refresh();
        break;
      case 'delete':
        if (!confirm('確定要刪除此群組嗎?（此動作會將所有人剔除該群組）'))
          return;
        setLoading(true);
        const groupUserEmails = group.users.map((user) => user.email);
        const responses = await Promise.all(groupUserEmails.map(getUser));
        await Promise.all(
          responses.map(({ data: user }) => {
            if (user) {
              putUser({
                ...user,
                groups: user.groups.filter((groupId) => groupId !== group.id),
              });
            }
          }),
        );
        await deleteGroup(group.id);
        refresh();
        setLoading(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-background relative grid w-full max-w-[350px] grid-cols-12 gap-4 rounded-xl p-4 shadow-md">
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 animate-pulse rounded-xl border border-solid border-transparent bg-gray-500/50 ${loading ? 'visible' : 'invisible'}`}
      ></div>
      <div className="col-span-10 flex flex-col justify-between gap-2">
        <h3 className="overflow-hidden text-base font-bold text-ellipsis whitespace-nowrap sm:text-lg">
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
      <Modal
        ref={modalRef}
        className="flex w-full flex-col self-end sm:max-w-96 sm:self-center sm:rounded-xl"
        title="邀請成員一起記帳！"
      >
        <div className="flex w-full flex-col items-center">
          <QRCode value={inviteLink} size={150} />
        </div>
        <div className="flex w-full flex-col gap-2 pt-6">
          <input
            type="text"
            className="w-full bg-transparent underline"
            value={inviteLink}
            readOnly
          />
          <div className="flex w-full items-center justify-end">
            <button
              type="button"
              className="bg-text text-background w-full rounded-md p-2 font-bold transition-colors hover:bg-gray-600 active:bg-gray-600"
              onClick={handleCopyInviteLink}
            >
              複製
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
