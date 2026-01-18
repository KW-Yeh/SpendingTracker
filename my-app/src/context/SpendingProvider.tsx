'use client';

import { useIDB } from '@/hooks/useIDB';
import { getItems } from '@/services/getRecords';
import { getCookie } from '@/utils/handleCookie';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  isInitialLoad: boolean;
  data: SpendingRecord[];
  syncData: (
    groupId?: string,
    email?: string,
    startDate?: string,
    endDate?: string,
  ) => void;
} = {
  loading: true,
  isInitialLoad: true,
  data: [],
  syncData: () => {},
};

type State = {
  data: SpendingRecord[];
  loading: boolean;
  isInitialLoad: boolean;
};

type Action =
  | { type: 'SET_DATA'; payload: SpendingRecord[] }
  | { type: 'SET_LOADING'; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        loading: false,
        // Once we have data, isInitialLoad becomes false permanently
        isInitialLoad: action.payload.length > 0 ? false : state.isInitialLoad,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: true,
    isInitialLoad: true,
  });
  const {
    db: IDB,
    getSpendingData: getDataFromIDB,
    setSpendingData: setData2IDB,
  } = useIDB();
  const controllerRef = useRef<AbortController | null>(null);

  const handleSetState = useCallback((_data: SpendingRecord[]) => {
    dispatch({ type: 'SET_DATA', payload: _data });
  }, []);

  const queryItem = useCallback(
    (
      email?: string,
      groupId?: string,
      startDate?: string,
      endDate?: string,
    ) => {
      if (!email && !groupId) return;
      getItems(groupId, email, startDate, endDate)
        .then((res) => {
          if (controllerRef.current) {
            controllerRef.current.abort();
          }
          console.log('Get Data from API');
          handleSetState(res.data);
          setData2IDB(IDB, res.data, Number(groupId), startDate)
            .then(() => {
              console.log('Update IDB success.');
            })
            .catch((err) => {
              console.log('Update IDB failed: ', err);
            });
        })
        .catch(console.error);
    },
    [IDB, handleSetState, setData2IDB],
  );

  const syncData = useCallback(
    async (
      groupId?: string,
      email?: string,
      startDate?: string,
      endDate?: string,
    ) => {
      // Set loading to true when starting sync
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!groupId) {
        queryItem(email, groupId, startDate, endDate);
        return;
      }

      // Try to load from IndexedDB first (Stale-While-Revalidate)
      let cacheHit = false;
      if (IDB) {
        try {
          const cachedData = await getDataFromIDB(IDB, Number(groupId), new AbortController().signal);
          if (cachedData && cachedData.length > 0) {
            const _data = JSON.parse(cachedData[0].data) as SpendingRecord[];
            if (_data.length > 0) {
              console.log('[SpendingProvider] Using cached spending data');
              handleSetState(_data);
              cacheHit = true;
            }
          }
        } catch (error) {
          console.error('[SpendingProvider] Error reading cache:', error);
        }
      }

      // If no cache hit, keep loading state true until API returns
      if (!cacheHit) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }

      // Revalidate in background
      queryItem(email, groupId, startDate, endDate);
    },
    [queryItem, IDB, getDataFromIDB, handleSetState],
  );

  const ctxVal = useMemo(
    () => ({
      ...state,
      syncData,
    }),
    [state, syncData],
  );

  useEffect(() => {
    const controller = (controllerRef.current = new AbortController());
    const groupId = getCookie('currentGroupId');
    if (IDB && groupId) {
      getDataFromIDB(IDB, Number(groupId), controller.signal)
        .then((res) => {
          if (res && res.length === 1) {
            const _data = JSON.parse(res[0].data) as SpendingRecord[];
            // console.log('Get Data from IDB', _data);
            if (_data.length !== 0) {
              handleSetState(_data);
              controllerRef.current = null;
            }
          }
        })
        .catch((err) => {
          console.log('Error while syncing data: ', err);
        });
    }
    return () => controller.abort();
  }, [IDB, getDataFromIDB, handleSetState]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
