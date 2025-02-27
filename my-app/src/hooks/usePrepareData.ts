'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getItems } from '@/services/getRecords';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export const usePrepareData = () => {
  const { data: session } = useSession();
  const { syncGroup } = useGroupCtx();
  const { config: userData, syncUser } = useUserConfigCtx();
  const { setter: setRecords } = useGetSpendingCtx();

  useEffect(() => {
    if (userData?.groups) {
      syncGroup(userData.groups);
    }
  }, [userData?.groups, syncGroup]);

  useEffect(() => {
    if (session?.user?.email) {
      getItems(undefined, session.user.email).then(({ data }) => {
        setRecords(data);
      });
      syncUser();
    }
  }, [session?.user?.email, setRecords, syncUser]);
};
