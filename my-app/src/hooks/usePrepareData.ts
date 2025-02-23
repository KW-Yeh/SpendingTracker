'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useEffect } from 'react';

export const usePrepareData = () => {
  const { config } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();
  const { syncGroup } = useGroupCtx();

  useEffect(() => {
    if (config?.email) {
      syncData(undefined, config.email, new Date().toUTCString());
    }
    if (config?.groups) {
      syncGroup(config.groups);
    }
  }, [config?.groups, config?.email, syncData, syncGroup]);
};
