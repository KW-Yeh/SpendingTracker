'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { createGroup } from '@/services/groupServices';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { getCookie } from '@/utils/handleCookie';
import { useEffect } from 'react';

export const usePrepareData = () => {
  const { syncGroup, groups, setCurrentGroup, currentGroup, loading } =
    useGroupCtx();
  const { config: userData, syncUser } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();

  useEffect(() => {
    console.log('Syncing groups for user', userData?.user_id);
    if (userData?.user_id) {
      syncGroup(userData.user_id);
    }
  }, [userData?.user_id, syncGroup]);

  useEffect(() => {
    console.log('Checking to set default current group', {
      groups,
      currentGroup,
    });
    if (groups.length > 0 && !currentGroup) {
      const currentGroupId = getCookie('currentGroupId');
      const defaultGroup = currentGroupId
        ? groups.find((group) => String(group.account_id) === currentGroupId)
        : groups.sort(
            (a, b) =>
              (a.created_at ? new Date(a.created_at).getTime() : 0) -
              (b.created_at ? new Date(b.created_at).getTime() : 0),
          )[0];
      console.log('Setting default current group', defaultGroup);
      setCurrentGroup(defaultGroup);
    }
  }, [groups, setCurrentGroup, currentGroup]);

  useEffect(() => {
    if (!loading && groups.length === 0 && userData?.user_id) {
      // If no groups exist, create a default group
      const newGroup = {
        name: `${userData.name} 的個人帳本`,
        owner_id: userData.user_id,
      };
      createGroup(newGroup).then((res) => {
        if (res.status) {
          syncGroup(userData.user_id);
        }
      });
    }
  }, [loading, groups.length, userData?.user_id, syncGroup, userData?.name]);

  useEffect(() => {
    console.log('Preparing data for', {
      email: userData?.email,
      group: currentGroup?.account_id,
    });
    if (userData?.email && currentGroup?.account_id) {
      const { startDate, endDate } = getStartEndOfMonth(new Date());
      syncData(
        String(currentGroup.account_id),
        userData.email,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    }
  }, [userData?.email, syncData, currentGroup?.account_id]);

  useEffect(() => {
    syncUser();
  }, [syncUser]);
};
