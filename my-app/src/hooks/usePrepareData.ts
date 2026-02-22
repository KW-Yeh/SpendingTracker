'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { createGroup } from '@/services/groupServices';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { getCookie } from '@/utils/handleCookie';
import { useEffect } from 'react';

export const usePrepareData = () => {
  const { syncGroup, groups, setCurrentGroup, currentGroup, setter: setGroups, loading } =
    useGroupCtx();
  const { config: userData, syncUser } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();

  useEffect(() => {
    if (userData?.user_id) {
      syncGroup(userData.user_id);
    }
  }, [userData?.user_id, syncGroup]);

  useEffect(() => {
    if (groups.length > 0 && !currentGroup) {
      const currentGroupId = getCookie('currentGroupId') || '';
      const defaultGroup =
        groups.find((group) => String(group.account_id) === currentGroupId) ??
        groups.sort(
          (a, b) =>
            (a.created_at ? new Date(a.created_at).getTime() : 0) -
            (b.created_at ? new Date(b.created_at).getTime() : 0),
        )[0];
      setCurrentGroup(defaultGroup);
    }
  }, [groups, setCurrentGroup, currentGroup]);

  // Cloud-first: create default group via API, then update local state
  useEffect(() => {
    if (!loading && groups.length === 0 && userData?.user_id) {
      const newGroup: Group = {
        account_id: Date.now(),
        name: `${userData.name} 的個人帳本`,
        owner_id: userData.user_id,
        members: [userData.user_id],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      createGroup(newGroup)
        .then(() => {
          setGroups([newGroup], userData.user_id);
        })
        .catch((err) => {
          console.error('[usePrepareData] Error creating default group:', err);
          // Fallback: still set locally so user can use the app
          setGroups([newGroup], userData.user_id);
        });
    }
  }, [loading, groups.length, userData?.user_id, setGroups, userData?.name]);

  useEffect(() => {
    if (currentGroup?.account_id) {
      const { startDate, endDate } = getStartEndOfMonth(new Date());
      syncData(
        String(currentGroup.account_id),
        undefined,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    }
  }, [userData?.email, syncData, currentGroup?.account_id]);

  useEffect(() => {
    syncUser();
  }, [syncUser]);
};
