'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getItems } from '@/services/recordActions';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export const usePrepareData = () => {
  const { data: session } = useSession();
  const { syncGroup } = useGroupCtx();
  const { config: userData, syncUser } = useUserConfigCtx();
  const { setter: setRecords } = useGetSpendingCtx();
  const isInit = useRef(false);

  useEffect(() => {
    if (userData?.groups) {
      syncGroup(userData.groups);
    }
  }, [userData?.groups]);

  useEffect(() => {
    if (session?.user?.email && !isInit.current) {
      isInit.current = true;
      getItems(undefined, session.user.email).then(({data}) => {
        setRecords(data);
      });
      syncUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);
};
