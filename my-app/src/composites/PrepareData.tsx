'use client';

import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useEffect } from 'react';

export const PrepareData = () => {
  const { config } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();
  const { syncGroup } = useGroupCtx();

  useEffect(() => {
    if (config) {
      syncData(undefined, config.email);
      syncGroup(config.groups);
    }
  }, [config, syncData, syncGroup]);

  return <></>;
};
