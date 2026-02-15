'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { getCookie } from '@/utils/handleCookie';
import { useEffect } from 'react';

export const usePrepareData = () => {
  const { syncGroup, groups, setCurrentGroup, currentGroup, setter: setGroups, loading } =
    useGroupCtx();
  const { config: userData, syncUser } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();

  useEffect(() => {
    // console.log('Syncing groups for user', userData?.user_id);
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
      const currentGroupId = getCookie('currentGroupId') || '';
      const defaultGroup =
        groups.find((group) => String(group.account_id) === currentGroupId) ??
        groups.sort(
          (a, b) =>
            (a.created_at ? new Date(a.created_at).getTime() : 0) -
            (b.created_at ? new Date(b.created_at).getTime() : 0),
        )[0];
      // console.log('Setting default current group', defaultGroup);
      setCurrentGroup(defaultGroup);
    }
  }, [groups, setCurrentGroup, currentGroup]);

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
      setGroups([newGroup], userData.user_id);
    }
  }, [loading, groups.length, userData?.user_id, setGroups, userData?.name]);

  useEffect(() => {
    // console.log('Preparing data for', {
    //   email: userData?.email,
    //   group: currentGroup?.account_id,
    // });
    if (currentGroup?.account_id) {
      const { startDate, endDate } = getStartEndOfMonth(new Date());
      // 使用 groupId 查詢，這樣帳本內所有成員都可以看到所有交易
      syncData(
        String(currentGroup.account_id),
        undefined, // 不傳 email，讓所有成員都能看到帳本的所有交易
        startDate.toISOString(),
        endDate.toISOString(),
      );
    }
  }, [userData?.email, syncData, currentGroup?.account_id]);

  useEffect(() => {
    syncUser();
  }, [syncUser]);
};
