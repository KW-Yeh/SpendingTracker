'use client';

import { getUser, putUser } from '@/services/userDataActions';
import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
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
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const handleState = (value: User) => {
    setConfig(value);
    setLoading(false);
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
        .then(({ data: res }) => {
          if (!res?.email) {
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

  const handleLogin = useCallback(() => {
    if (pathname !== '/login') {
      redirect('/login');
    }
  }, [pathname]);

  useEffect(() => {
    if (status === 'authenticated') {
      syncUser();
    } else if (status === 'unauthenticated') {
      handleLogin();
    }
  }, [syncUser, status, handleLogin]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useUserConfigCtx = () => useContext(Ctx);
