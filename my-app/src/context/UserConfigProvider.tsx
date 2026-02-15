'use client';

import { useIDB } from '@/hooks/useIDB';
import { getUser, createUser } from '@/services/userServices';
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
  const initializedRef = useRef(false);

  const handleState = useCallback((value: User) => {
    setConfig(value);
    setLoading(false);
  }, []);

  // IDB-only: write to IDB + update local state (no API call)
  const handleUpdateUser = useCallback(async (value: User) => {
    const updatedUser = { ...value, updated_at: new Date().toISOString() };
    await setUserData(IDB, updatedUser);
    setConfig(updatedUser);
  }, [IDB, setUserData]);

  const handleUpdateBudgetData = useCallback(
    async (value: UserBudgetData) => {
      setBudgetDataState(value);
    },
    [],
  );

  // Re-read user from IDB (used after sync completes to refresh state)
  const syncUser = useCallback(() => {
    if (!IDB || !session?.user?.email) return;
    setLoading(true);
    const controller = new AbortController();
    getUserData(IDB, session.user.email, controller.signal)
      .then((res) => {
        if (res) {
          const _data = JSON.parse(res.data) as User;
          handleState(_data);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[UserConfigProvider] Error re-reading from IDB:', err);
        setLoading(false);
      });
  }, [IDB, session?.user?.email, getUserData, handleState]);

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

  // Load user from IDB on mount
  useEffect(() => {
    const controller = (controllerRef.current = new AbortController());
    if (IDB && !config && session?.user?.email) {
      getUserData(IDB, session.user.email, controller.signal)
        .then((res) => {
          if (res) {
            const _data = JSON.parse(res.data) as User;
            handleState(_data);
            controllerRef.current = null;
            initializedRef.current = true;
          } else {
            // No user in IDB — first time login, need to create via API
            initializedRef.current = true;
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log('Error while reading IDB:', err);
        });
    }
    return () => controller.abort();
  }, [IDB, config, getUserData, handleState, session?.user?.email]);

  // First-time login: if IDB has no user and session is authenticated,
  // create user via API and store in IDB (one-time exception)
  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.email &&
      IDB &&
      initializedRef.current &&
      !config
    ) {
      console.log('[UserConfigProvider] No local user, creating via API...');
      const email = session.user.email;

      const createAndFetch = async (retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 3000;

        try {
          const res = await getUser(email);
          if (res.status && res.data) {
            await setUserData(IDB, res.data);
            handleState(res.data);
            return;
          }

          // User not found in cloud, create
          if (retryCount < MAX_RETRIES) {
            await createUser({
              user_id: Date.now(),
              name: session.user?.name || '匿名',
              email,
            });
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
            await createAndFetch(retryCount + 1);
          } else {
            console.error('Max retries reached for user creation');
          }
        } catch (err) {
          console.error('[UserConfigProvider] Error creating user:', err);
        }
      };

      createAndFetch();
    }
  }, [status, session?.user?.email, session?.user?.name, IDB, config, setUserData, handleState]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useUserConfigCtx = () => useContext(Ctx);
