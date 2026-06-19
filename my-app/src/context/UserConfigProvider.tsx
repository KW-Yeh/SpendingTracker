'use client';

import { getUser, createUser, putUser } from '@/services/userServices';
import { getCachedUser, setCachedUser } from '@/utils/localCache';
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
  isFetching: boolean;
  hasEverLoaded: boolean;
  config?: User;
  budgetData: UserBudgetData;
  syncUser: () => void;
  setter: (value: User) => Promise<void>;
  setBudgetData: (value: UserBudgetData) => Promise<void>;
} = {
  loading: true,
  isFetching: false,
  hasEverLoaded: false,
  config: undefined,
  budgetData: { budget: [] },
  syncUser: () => {},
  setter: async () => {},
  setBudgetData: async () => {},
};

export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  // Synchronous warm-start from localStorage so the first paint already has
  // the user — no skeleton flash.
  const [config, setConfig] = useState<User | undefined>(
    () => getCachedUser() ?? undefined,
  );
  const [hasEverLoaded, setHasEverLoaded] = useState<boolean>(
    () => getCachedUser() !== null,
  );
  const [isFetching, setIsFetching] = useState(false);
  const [budgetData, setBudgetDataState] = useState<UserBudgetData>({
    budget: [],
  });
  const { data: session, status } = useSession();
  // Track latest config in a ref so the bootstrap effect can read it without
  // adding config to its deps (which would cause unnecessary re-runs).
  const configRef = useRef<User | undefined>(config);
  configRef.current = config;
  const pathname = usePathname();

  const handleState = useCallback((value: User) => {
    setConfig(value);
    setHasEverLoaded(true);
    setCachedUser(value);
  }, []);

  const handleUpdateUser = useCallback(
    async (value: User) => {
      const updatedUser = { ...value, updated_at: new Date().toISOString() };
      try {
        await putUser(updatedUser);
        handleState(updatedUser);
      } catch (error) {
        console.error(
          '[UserConfigProvider] Error updating user in API:',
          error,
        );
      }
    },
    [handleState],
  );

  const handleUpdateBudgetData = useCallback(async (value: UserBudgetData) => {
    setBudgetDataState(value);
  }, []);

  const syncUser = useCallback(async () => {
    if (!session?.user?.email) return;
    setIsFetching(true);

    try {
      const res = await getUser(session.user.email);
      if (res.status && res.data) {
        handleState(res.data);
      }
    } catch (error) {
      console.error('[UserConfigProvider] Error fetching from API:', error);
    } finally {
      setIsFetching(false);
    }
  }, [session?.user?.email, handleState]);

  const ctxVal = useMemo(
    () => ({
      // `loading` kept for backwards-compatible consumers; it's truthy only
      // before we have any data at all.
      loading: !hasEverLoaded,
      isFetching,
      hasEverLoaded,
      config,
      budgetData,
      syncUser,
      setter: handleUpdateUser,
      setBudgetData: handleUpdateBudgetData,
    }),
    [
      hasEverLoaded,
      isFetching,
      config,
      budgetData,
      syncUser,
      handleUpdateUser,
      handleUpdateBudgetData,
    ],
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

  // Bootstrap: fetch the user from the API (source of truth), creating it
  // on first login. localStorage already gave us synchronous state for the
  // first paint.
  useEffect(() => {
    if (session?.user?.email && status === 'authenticated') {
      const email = session.user.email;
      const userName = session.user?.name || '匿名';

      // If syncUser() already resolved the user, nothing to bootstrap.
      if (configRef.current) return;

      setIsFetching(true);

      const createAndFetch = async (retryCount = 0): Promise<void> => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 3000;

        const apiRes = await getUser(email);
        if (apiRes.status && apiRes.data) {
          handleState(apiRes.data);
          return;
        }
        if (retryCount < MAX_RETRIES) {
          await createUser({ user_id: Date.now(), name: userName, email });
          await new Promise((r) => setTimeout(r, RETRY_DELAY));
          await createAndFetch(retryCount + 1);
        } else {
          console.error('Max retries reached for user creation');
        }
      };

      createAndFetch()
        .catch((err) =>
          console.error('[UserConfigProvider] Error syncing user:', err),
        )
        .finally(() => setIsFetching(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email, status]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useUserConfigCtx = () => useContext(Ctx);
