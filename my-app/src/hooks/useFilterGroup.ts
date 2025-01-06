'use client';

import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { USER_TOKEN_SEPARATOR } from '@/utils/constants';
import { useEffect, useState } from 'react';

export const useFilterGroup = (groupId?: string) => {
  const { data } = useGetSpendingCtx();
  const { config: userData } = useUserConfigCtx();
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(
      data.filter((d) => {
        const tokens = d['user-token'].split(USER_TOKEN_SEPARATOR);
        if (groupId && tokens.length === 2) {
          return tokens[1] === groupId;
        } else if (!groupId && tokens.length === 1 && userData?.email) {
          return tokens[0] === userData.email;
        }
      }),
    );
  }, [data, groupId, userData?.email]);

  return { filteredData };
};
