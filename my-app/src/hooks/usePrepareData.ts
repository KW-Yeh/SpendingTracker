'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getAllData } from '@/services/getAllData';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export const usePrepareData = () => {
  const { data: session } = useSession();
  const { setter: setGroups } = useGroupCtx();
  const { setter: setUser } = useUserConfigCtx();
  const { setter: setRecords } = useGetSpendingCtx();
  const isInit = useRef(false);

  useEffect(() => {
    if (session?.user?.email && !isInit.current) {
      isInit.current = true;
      getAllData(session.user.email).then((res) => {
        setUser(res.user);
        setRecords(res.records);
        setGroups(res.groups);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);
};
