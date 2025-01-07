'use client';

import { getUser, putUser } from '@/services/dbHandler';
import { useSession } from 'next-auth/react';
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
  config?: User;
  syncUser: () => void;
} = {
  loading: true,
  config: undefined,
  syncUser: () => {},
};

export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<User>();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const handleState = (value: User) => {
    setConfig(value);
    startTransition(() => {
      setLoading(false);
    });
  };

  const handleNewUser = useCallback(
    async (email: string) => {
      if (session?.user) {
        await putUser({
          name: session.user.name || '匿名',
          email: email,
          image: session.user.image || '',
          groups: [],
        });
      }
    },
    [session?.user],
  );

  const queryUser = useCallback(
    (email: string) => {
      getUser(email)
        .then((res) => {
          if (!res.email) {
            handleNewUser(email).then(() => {
              setTimeout(() => {
                queryUser(email);
              }, 3000);
            });
          } else {
            handleState(res);
          }
        })
        .catch(console.error);
    },
    [handleNewUser],
  );

  const syncUser = useCallback(() => {
    setLoading(true);
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }
    queryUser(session.user.email);
  }, [queryUser, session?.user?.email]);

  const ctxVal = useMemo(
    () => ({
      loading,
      config,
      syncUser,
    }),
    [loading, config, syncUser],
  );

  useEffect(() => {
    if (session?.user?.email) {
      syncUser();
    }
  }, [session?.user?.email, syncUser]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useUserConfigCtx = () => useContext(Ctx);
