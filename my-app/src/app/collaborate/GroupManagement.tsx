'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { Select } from '@/components/Select';
import { Modal } from '@/components/Modal';
import { useGroupCtx } from '@/context/GroupProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { deleteGroup, putGroup } from '@/services/groupServices';
import { getUser, putUser } from '@/services/userServices';
import { MOCK_GROUPS, USE_MOCK_DATA } from '@/utils/mockData';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { v7 as uuid } from 'uuid';

export const GroupManagement = () => {
  const { config: userData, syncUser } = useUserConfigCtx();
  const { groups, currentGroup, setCurrentGroup, syncGroup, setter } =
    useGroupCtx();
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<ModalRef>(null);

  // 使用測試資料
  useEffect(() => {
    if (USE_MOCK_DATA && groups.length === 0) {
      setter(MOCK_GROUPS);
      // 預設選擇第一個群組
      if (MOCK_GROUPS.length > 0) {
        setCurrentGroup(MOCK_GROUPS[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInviteLink = () => {
    if (!currentGroup) return '';
    const origin =
      globalThis.window === undefined ? '' : globalThis.window.location.origin;
    return `${origin}/group/invite/${currentGroup.id}`;
  };
  const inviteLink = getInviteLink();

  const handleCreateGroup = useCallback(async () => {
    if (!userData) return;
    const groupName = prompt('請輸入群組名稱');
    if (!groupName) return;
    const groupId = uuid();
    // 暫時不實作 API call
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

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('已複製邀請連結');
      modalRef.current?.close();
    });
  };

  const handleGroupAction = async (action: string) => {
    if (!currentGroup) return;

    switch (action) {
      case 'invite': {
        modalRef.current?.open();
        break;
      }
      case 'edit': {
        const newName = prompt('請輸入新的群組名稱', currentGroup.name);
        if (!newName || newName === currentGroup.name) return;
        setLoading(true);
        // 暫時不實作 API call
        await putGroup({
          ...currentGroup,
          name: newName,
        });
        syncGroup(userData?.groups || []);
        setLoading(false);
        break;
      }
      case 'remove-member': {
        alert('移除成員功能尚未實作');
        break;
      }
      case 'delete': {
        if (!confirm('確定要刪除此群組嗎？（此動作會將所有人剔除該群組）'))
          return;
        setLoading(true);
        const groupUserEmails = currentGroup.users.map((user) => user.email);
        const responses = await Promise.all(groupUserEmails.map(getUser));
        // 暫時不實作 API call
        const putUserPromises = responses.map(({ data: user }) => {
          if (user) {
            return putUser({
              ...user,
              groups: user.groups.filter(
                (groupId) => groupId !== currentGroup.id,
              ),
            });
          }
          return Promise.resolve();
        });
        await Promise.all(putUserPromises);
        await deleteGroup(currentGroup.id);
        setCurrentGroup(undefined);
        syncGroup(userData?.groups || []);
        setLoading(false);
        break;
      }
      default:
        break;
    }
  };

  const handleGroupChange = (groupId: string) => {
    const selected = groups.find((g) => g.id === groupId);
    setCurrentGroup(selected);
  };

  return (
    <div className="bg-background w-full rounded-2xl border border-solid border-gray-200 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">群組管理</h2>
        <button
          type="button"
          onClick={handleCreateGroup}
          className="gradient-r-from-purple-to-blue flex items-center rounded-md px-4 py-2 text-sm"
        >
          <PlusIcon className="mr-2 size-4" />
          <span>建立群組</span>
        </button>
      </div>

      {groups.length > 0 ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label
              htmlFor="group-select"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              選擇群組
            </label>
            <Select
              name="group-select"
              value={currentGroup?.id || ''}
              label={currentGroup?.name || '請選擇群組'}
              onChange={(value) => handleGroupChange(value)}
              className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors hover:border-gray-500 active:border-gray-500"
            >
              {groups.map((group) => (
                <Select.Item key={group.id} value={group.id}>
                  {group.name}
                </Select.Item>
              ))}
            </Select>
          </div>

          {currentGroup && (
            <div className="flex flex-col gap-2">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                成員 ({currentGroup.users.length})
              </label>
              <div className="flex items-center gap-2">
                {currentGroup.users.map((user) => (
                  <Image
                    key={user.email}
                    src={user.image}
                    alt={user.name}
                    title={user.name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full border-2 border-gray-200"
                  />
                ))}
                <ActionMenu
                  onClick={handleGroupAction}
                  options={[
                    {
                      value: 'invite',
                      label: (
                        <>
                          <LinkIcon className="size-4" />
                          <span>邀請成員</span>
                        </>
                      ),
                    },
                    {
                      value: 'edit',
                      label: (
                        <>
                          <EditIcon className="size-4" />
                          <span>編輯群組名稱</span>
                        </>
                      ),
                    },
                    {
                      value: 'delete',
                      label: (
                        <>
                          <DeleteIcon className="size-4" />
                          <span>刪除群組</span>
                        </>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">尚無群組，請建立新群組開始使用</p>
      )}

      {/* 邀請成員 Modal */}
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

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6">
            <p className="text-lg">處理中...</p>
          </div>
        </div>
      )}
    </div>
  );
};
