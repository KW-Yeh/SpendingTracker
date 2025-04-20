'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export const usePrepareData = () => {
  const { data: session } = useSession();
  const { syncGroup } = useGroupCtx();
  const { config: userData, syncUser } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();

  useEffect(() => {
    if (userData?.groups) {
      syncGroup(userData.groups);
    }
  }, [userData?.groups, syncGroup]);

  useEffect(() => {
    if (session?.user?.email) {
      const startDate = new Date();
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        new Date(startDate.getFullYear(), startDate.getMonth(), 0).getDate()-1,
        23,
        59,
        59,
      );
      syncData(
        undefined,
        session.user.email,
        startDate.toISOString(),
        endDate.toISOString(),
      );
      syncUser();
    }
  }, [session?.user?.email, syncData, syncUser]);
};
