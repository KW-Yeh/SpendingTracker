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
      syncData(undefined, session.user.email);
      syncUser();
    }
  }, [session?.user?.email, syncData, syncUser]);
};
