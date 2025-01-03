'use client';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useRoleCtx } from '@/context/UserRoleProvider';
import { getItems } from '@/services/dbHandler';
import { USER_TOKEN_SEPARATOR } from '@/utils/constants';
import {
  createContext,
  ReactNode,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  data: SpendingRecord[];
  syncData: () => void;
} = {
  loading: true,
  data: [],
  syncData: () => {},
};

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { config, loading: loadingConfig } = useUserConfigCtx();
  const { group, loading: loadingGroup } = useRoleCtx();
  const [data, setData] = useState<SpendingRecord[]>([]);

  const handleState = useCallback(
    (res: SpendingRecord[], userToken: string, isEmail: boolean) => {
      setData(
        res.filter((d) =>
          isEmail
            ? d['user-token'] === userToken
            : d['user-token'].split(USER_TOKEN_SEPARATOR)[1] === userToken,
        ),
      );
      startTransition(() => {
        setLoading(false);
      });
    },
    [],
  );

  const queryItem = useCallback(
    (userToken: string, isEmail: boolean) => {
      getItems()
        .then((res) => res.json())
        .then((res: SpendingRecord[]) => {
          handleState(res, userToken, isEmail);
        })
        .catch(console.error);
    },
    [handleState],
  );

  const syncData = useCallback(() => {
    setLoading(true);
    if (!loadingConfig && config?.defaultGroup && !loadingGroup && group) {
      queryItem(group.id, false);
    } else if (!loadingConfig && config) {
      queryItem(config.email, true);
    }
  }, [loadingGroup, group, queryItem, config, loadingConfig]);

  const ctxVal = useMemo(
    () => ({
      loading,
      data,
      syncData,
    }),
    [loading, data, syncData],
  );

  useEffect(() => {
    if (!loadingConfig && config?.defaultGroup && !loadingGroup && group) {
      queryItem(group.id, false);
    } else if (!loadingConfig && config) {
      queryItem(config.email, true);
    }
  }, [config, group, loadingConfig, loadingGroup, queryItem]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
