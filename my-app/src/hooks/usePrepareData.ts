'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
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
      const { startDate, endDate } = getStartEndOfMonth(new Date());
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
