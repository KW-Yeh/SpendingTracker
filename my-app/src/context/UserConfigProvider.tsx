'use client';

import { useIDB } from '@/hooks/useIDB';
import { getUser, createUser, putUser } from '@/services/userServices';
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

  // Cloud-first: write to API, then update local state + IDB cache
  const handleUpdateUser = useCallback(async (value: User) => {
    const updatedUser = { ...value, updated_at: new Date().toISOString() };

    try {
      await putUser(updatedUser);
      setConfig(updatedUser);
      // Update IDB cache
      if (IDB) {
        await setUserData(IDB, updatedUser);
      }
    } catch (error) {
      console.error('[UserConfigProvider] Error updating user in API:', error);
    }
  }, [IDB, setUserData]);

  const handleUpdateBudgetData = useCallback(
    async (value: UserBudgetData) => {
      setBudgetDataState(value);
    },
    [],
  );

  // Cloud-first: fetch user from API, show IDB cache first
  const syncUser = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);

    // Show IDB cache first for fast render
    if (IDB) {
      try {
        const controller = new AbortController();
        const cachedData = await getUserData(IDB, session.user.email, controller.signal);
        if (cachedData) {
          const _data = JSON.parse(cachedData.data) as User;
          handleState(_data);
        }
      } catch {
        // IDB cache miss is fine
      }
    }

    // Fetch from API (source of truth)
    try {
      const res = await getUser(session.user.email);
      if (res.status && res.data) {
        handleState(res.data);
        // Update IDB cache
        if (IDB) {
          await setUserData(IDB, res.data);
        }
      }
    } catch (error) {
      console.error('[UserConfigProvider] Error fetching from API:', error);
      setLoading(false);
    }
  }, [IDB, session?.user?.email, getUserData, setUserData, handleState]);

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

  // Load user: IDB cache first, then API
  useEffect(() => {
    const controller = (controllerRef.current = new AbortController());
    if (IDB && !config && session?.user?.email) {
      const email = session.user.email;

      // Try IDB cache first for fast render
      getUserData(IDB, email, controller.signal)
        .then(async (res) => {
          if (res) {
            const _data = JSON.parse(res.data) as User;
            handleState(_data);
            controllerRef.current = null;
            initializedRef.current = true;
          } else {
            initializedRef.current = true;
            setLoading(false);
          }

          // Then fetch from API to get latest
          try {
            const apiRes = await getUser(email);
            if (apiRes.status && apiRes.data) {
              handleState(apiRes.data);
              await setUserData(IDB, apiRes.data);
            }
          } catch {
            // API fetch failed, IDB cache is still shown
          }
        })
        .catch((err) => {
          console.log('Error while reading IDB:', err);
        });
    }
    return () => controller.abort();
  }, [IDB, config, getUserData, setUserData, handleState, session?.user?.email]);

  // First-time login: if no user found anywhere, create via API
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
