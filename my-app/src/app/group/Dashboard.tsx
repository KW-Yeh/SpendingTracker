'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { LeaveIcon } from '@/components/icons/LeaveIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { SendIcon } from '@/components/icons/SendIcon';
import { Modal } from '@/components/Modal';
import { useGroupCtx } from '@/context/GroupProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import {
  removeGroupMember,
  getGroupMembers,
} from '@/services/groupServices';
import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

export const Dashboard = () => {
  const { config: userData, syncUser } = useUserConfigCtx();
  const { groups, syncGroup, setter: setGroups, loading } = useGroupCtx();

  const refresh = useCallback(() => {
    if (userData) {
      syncGroup(userData.user_id);
    }
  }, [userData, syncGroup]);

  const handleCreateGroup = useCallback(async () => {
    if (!userData) return;
    const groupName = prompt('請輸入身分群組名稱');
    if (!groupName) return;
    const newGroup: Group = {
      account_id: Date.now(),
      name: groupName,
      owner_id: userData.user_id,
      members: [userData.user_id],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGroups([...groups, newGroup], userData.user_id);
  }, [userData, groups, setGroups]);

  return (
    <div className="content-wrapper">
      <div className="flex w-full items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleCreateGroup}
          className="btn-primary flex min-h-11 items-center text-sm"
        >
          <PlusIcon className="mr-2 size-4" />
          <span>建立新帳本</span>
        </button>
      </div>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
        {groups.map((group) => (
          <GroupCard key={group.account_id} group={group} refresh={refresh} />
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
  const { config: userData } = useUserConfigCtx();
  const { groups, setter: setGroups } = useGroupCtx();
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group.name);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const inviteLink = `${location.origin}/group/invite/${group.account_id}`;
  const modalRef = useRef<ModalRef>(null);

  const isOwner = userData?.user_id === group.owner_id;

  const fetchMembers = useCallback(async () => {
    if (!group.account_id) return;
    setLoadingMembers(true);
    try {
      const result = await getGroupMembers(group.account_id);
      if (result.status) {
        setMembers(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMembers(false);
    }
  }, [group.account_id]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('已複製邀請連結');
      modalRef.current?.close();
    });
  };

  const handleEditGroupName = async () => {
    if (!newGroupName.trim()) {
      alert('群組名稱不能為空');
      return;
    }

    const updatedGroups = groups.map((g) =>
      g.account_id === group.account_id
        ? { ...g, name: newGroupName, updated_at: new Date().toISOString() }
        : g,
    );
    setGroups(updatedGroups, userData?.user_id);
    alert('群組名稱已更新');
    setEditModalOpen(false);
  };

  const handleRemoveMember = async (userId: number, userName: string) => {
    if (!group.account_id) return;

    const confirmRemove = window.confirm(`確定要移除成員「${userName}」嗎？`);
    if (!confirmRemove) return;

    setLoading(true);
    try {
      const result = await removeGroupMember(group.account_id, userId);
      if (result.status) {
        alert('成員已移除');
        await fetchMembers();
        refresh();
      } else {
        alert(result.message || '移除失敗');
      }
    } catch (error) {
      console.error(error);
      alert('移除失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    switch (action) {
      case 'invite':
        modalRef.current?.open();
        break;

      case 'edit':
        if (!isOwner) {
          alert('只有群組擁有者可以編輯群組名稱');
          return;
        }
        setNewGroupName(group.name);
        setEditModalOpen(true);
        break;

      case 'delete':
        if (!isOwner) {
          alert('只有群組擁有者可以刪除群組');
          return;
        }
        const confirmDelete = window.confirm(
          `確定要刪除群組「${group.name}」嗎？此操作無法復原。`,
        );
        if (confirmDelete) {
          const filteredGroups = groups.filter(
            (g) => g.account_id !== group.account_id,
          );
          setGroups(filteredGroups, userData?.user_id);
          alert('群組已刪除');
        }
        break;

      case 'leave':
        if (isOwner) {
          alert('群組擁有者不能直接離開群組。請先轉移擁有權或刪除群組。');
          return;
        }
        const confirmLeave = window.confirm(
          `確定要離開群組「${group.name}」嗎？`,
        );
        if (confirmLeave && userData) {
          setLoading(true);
          try {
            await removeGroupMember(group.account_id!, userData.user_id);
            alert('已離開群組');
            refresh();
          } catch (error) {
            console.error(error);
            alert('離開失敗，請稍後再試');
          } finally {
            setLoading(false);
          }
        }
        break;

      case 'transfer':
        if (!isOwner) {
          alert('只有群組擁有者可以轉移擁有權');
          return;
        }
        alert('轉移擁有權功能尚未實作。需要先實作成員列表選擇功能。');
        break;

      default:
        break;
    }
  };

  return (
    <div className="card relative grid w-full max-w-87.5 grid-cols-12 gap-4 transition-all duration-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 animate-pulse rounded-xl border border-solid border-transparent bg-gray-500/50 ${loading ? 'visible' : 'invisible'}`}
      ></div>
      <div className="col-span-10 flex flex-col justify-between gap-2">
        <h3
          className="overflow-hidden text-base font-bold text-ellipsis whitespace-nowrap text-gray-100 sm:text-lg"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {group.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">成員:</span>
          {loadingMembers ? (
            <span className="text-xs text-gray-500">載入中...</span>
          ) : (
            <>
              <span className="text-sm font-medium text-gray-200">
                {members.length} 人
              </span>
              <button
                type="button"
                onClick={() => setMembersModalOpen(true)}
                className="text-primary-400 hover:text-primary-300 text-xs font-semibold underline transition-colors"
              >
                查看詳情
              </button>
            </>
          )}
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
                  <span>編輯名稱</span>
                </>
              ),
            },
            ...(!isOwner
              ? [
                  {
                    value: 'leave',
                    label: (
                      <>
                        <LeaveIcon className="size-4" />
                        <span>離開群組</span>
                      </>
                    ),
                    className: 'text-orange-500',
                  },
                ]
              : []),
            ...(isOwner
              ? [
                  {
                    value: 'transfer',
                    label: (
                      <>
                        <SendIcon className="size-4" />
                        <span>轉移擁有權</span>
                      </>
                    ),
                  },
                ]
              : []),
            ...(isOwner
              ? [
                  {
                    value: 'delete',
                    label: (
                      <>
                        <DeleteIcon className="size-4" />
                        <span>刪除群組</span>
                      </>
                    ),
                    className: 'text-red-500',
                  },
                ]
              : []),
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
              className="btn-primary min-h-11 w-full"
              onClick={handleCopyInviteLink}
            >
              複製
            </button>
          </div>
        </div>
      </Modal>
      {editModalOpen && (
        <Modal
          defaultOpen={true}
          onClose={() => setEditModalOpen(false)}
          className="flex w-full flex-col self-end sm:max-w-96 sm:self-center sm:rounded-xl"
          title="編輯群組名稱"
        >
          <div className="flex w-full flex-col gap-4">
            <input
              type="text"
              className="w-full rounded-md border border-solid border-gray-300 px-3 py-2"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="群組名稱"
            />
            <div className="flex w-full justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="btn-secondary min-h-11"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleEditGroupName}
                disabled={loading}
                className="btn-primary min-h-11 px-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? '更新中...' : '確定'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {membersModalOpen && (
        <Modal
          defaultOpen={true}
          onClose={() => setMembersModalOpen(false)}
          className="flex w-full flex-col self-end sm:max-w-lg sm:self-center sm:rounded-xl"
          title={`群組成員 (${members.length})`}
        >
          <div className="flex w-full flex-col gap-2">
            {loadingMembers ? (
              <div className="py-8 text-center text-gray-300">載入中...</div>
            ) : members.length === 0 ? (
              <div className="py-8 text-center text-gray-300">暫無成員</div>
            ) : (
              members.map((member) => {
                const isMemberOwner = member.user_id === group.owner_id;
                const isCurrentUser = member.user_id === userData?.user_id;
                return (
                  <div
                    key={member.user_id}
                    className="hover:border-primary-500/50 flex items-center justify-between rounded-xl border border-solid border-gray-600 p-3 transition-all hover:bg-gray-700/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-100">
                        {member.name || member.email}
                        {isCurrentUser && (
                          <span className="text-primary-400 ml-2 text-xs font-semibold">
                            (我)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                      <p className="text-xs font-medium text-gray-300">
                        角色: {member.role}
                        {isMemberOwner && ' (擁有者)'}
                      </p>
                    </div>
                    {isOwner && !isMemberOwner && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveMember(
                            member.user_id,
                            member.name || member.email || '未知用戶',
                          )
                        }
                        className="text-secondary-400 hover:bg-secondary-500/20 active:bg-secondary-500/30 min-h-8 min-w-8 rounded-lg p-2 transition-all"
                      >
                        <DeleteIcon className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
