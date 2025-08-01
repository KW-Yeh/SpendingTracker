'use client';

import { useIDB } from '@/hooks/useIDB';
import { getUser, putUser } from '@/services/userServices';
import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  config?: User;
  syncUser: () => void;
  setter: (value: User) => Promise<void>;
} = {
  loading: true,
  config: undefined,
  syncUser: () => {},
  setter: async () => {},
};

export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<User>();
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const { db: IDB, getUserData, setUserData } = useIDB();
  const controllerRef = useRef<AbortController>(new AbortController());
  const pathname = usePathname();

  const handleState = (value: User) => {
    setConfig(value);
    setLoading(false);
  };

  const handleUpdateUser = async (value: User) => {
    await putUser(value);
    // Update local state after API call
    setConfig(value);
  };

  const handleNewUser = useCallback(
    async (email: string) => {
      if (session?.user) {
        await putUser({
          name: session.user.name || '匿名',
          email: email,
          image: session.user.image || '',
          groups: [],
          budget: [],
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
            setUserData(IDB, res)
              .then(() => {
                console.log('Update User IDB success.');
              })
              .catch((err) => {
                console.log('Update User IDB failed: ', err);
              });
          }
        })
        .catch(console.error);
    },
    [IDB, handleNewUser, setUserData],
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
      setter: handleUpdateUser,
    }),
    [loading, config, syncUser],
  );

  const handleLogin = useCallback(() => {
    if (pathname !== '/login') {
      redirect('/login');
    }
  }, [pathname]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      handleLogin();
    }
  }, [status, handleLogin]);

  useEffect(() => {
    const controller = (controllerRef.current = new AbortController());
    if (IDB && !config) {
      getUserData(IDB, session?.user?.email ?? '', controller.signal)
        .then((res) => {
          if (res) {
            const _data = JSON.parse(res.data) as User;
            // console.log('Get User Data from IDB', _data);
            handleState(_data);
          }
        })
        .catch((err) => {
          console.log('Error while syncing data: ', err);
        });
    }
    return () => controller.abort();
  }, [IDB, config, getUserData, handleState, session?.user?.email]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useUserConfigCtx = () => useContext(Ctx);
