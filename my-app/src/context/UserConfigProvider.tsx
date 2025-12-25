'use client';

import { useIDB } from '@/hooks/useIDB';
import { getUser, putUser, createUser } from '@/services/userServices';
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
  budgetData: UserBudgetData;
  syncUser: () => void;
  setter: (value: User) => Promise<void>;
  setBudgetData: (value: UserBudgetData) => Promise<void>;
} = {
  loading: true,
  config: undefined,
  budgetData: { budget: [] },
  syncUser: () => {},
  setter: async () => {},
  setBudgetData: async () => {},
};

export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetDataState] = useState<UserBudgetData>({ budget: [] });
  const { data: session, status } = useSession();
  const { db: IDB, getUserData, setUserData } = useIDB();
  const controllerRef = useRef<AbortController | null>(null);
  const pathname = usePathname();

  const handleState = useCallback((value: User) => {
    setConfig(value);
    setLoading(false);
  }, []);

  const handleUpdateUser = useCallback(async (value: User) => {
    await putUser(value);
    // Update local state after API call
    setConfig(value);
  }, []);

  const handleUpdateBudgetData = useCallback(
    async (value: UserBudgetData) => {
      // Budget data is stored client-side only, no server sync needed
      setBudgetDataState(value);
      // TODO: Store budget data in IndexedDB separately if needed
    },
    [],
  );

  const handleNewUser = useCallback(
    async (email: string) => {
      if (session?.user) {
        await createUser({
          user_id: Date.now(),
          name: session.user.name || '匿名',
          email: email,
        });
      }
    },
    [session?.user],
  );

  const queryUser = useCallback(
    (email: string) => {
      getUser(email)
        .then((res) => {
          console.log('Querying user response: ', res);
          if (controllerRef.current) {
            controllerRef.current.abort();
          }
          if (res.status && res.data === null) {
            console.log('User not found, creating new user...');  
            handleNewUser(email).then(() => {
              setTimeout(() => {
                queryUser(email);
              }, 3000);
            });
          } else if (res.status && res.data !== null) {
            console.log('User found, updating local state...'); 
            handleState(res.data);
            setUserData(IDB, res.data)
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
    [IDB, handleNewUser, setUserData, handleState],
  );

  const syncUser = useCallback(() => {
    setLoading(true);
    if (session?.user?.email) {
      console.log('Syncing user: ', session.user.email);
      queryUser(session.user.email);
    }
  }, [queryUser, session?.user?.email]);

  const ctxVal = useMemo(
    () => ({
      loading,
      config,
      budgetData,
      syncUser,
      setter: handleUpdateUser,
      setBudgetData: handleUpdateBudgetData,
    }),
    [loading, config, budgetData, syncUser, handleUpdateUser, handleUpdateBudgetData],
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
    if (!session?.user?.email) {
      syncUser();
    }
  }, [session?.user?.email, syncUser]);

  useEffect(() => {
    const controller = (controllerRef.current = new AbortController());
    if (IDB && !config) {
      getUserData(IDB, session?.user?.email ?? '', controller.signal)
        .then((res) => {
          if (res) {
            const _data = JSON.parse(res.data) as User;
            // console.log('Get User Data from IDB', _data);
            handleState(_data);
            controllerRef.current = null;
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
