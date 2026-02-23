'use client';

import { useIDB } from '@/hooks/useIDB';
import {
  getItems,
  putItem,
  deleteItem as deleteItemAPI,
} from '@/services/getRecords';
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
  addRecord: (record: SpendingRecord, groupId: string | number) => Promise<void>;
  updateRecord: (record: SpendingRecord, groupId: string | number) => Promise<void>;
  deleteRecord: (recordId: string, groupId: string | number) => Promise<void>;
} = {
  loading: true,
  isInitialLoad: true,
  data: [],
  syncData: () => {},
  addRecord: async () => {},
  updateRecord: async () => {},
  deleteRecord: async () => {},
};

type State = {
  data: SpendingRecord[];
  loading: boolean;
  isInitialLoad: boolean;
};

type Action =
  | { type: 'SET_DATA'; payload: SpendingRecord[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIAL_LOAD_DONE' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_INITIAL_LOAD_DONE':
      return { ...state, isInitialLoad: false };
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

  // Cloud-first: fetch from API, cache to IDB
  const syncData = useCallback(
    async (
      groupId?: string,
      email?: string,
      startDate?: string,
      endDate?: string,
    ) => {
      if (!groupId) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      // Show IDB cache first for fast render
      if (IDB) {
        try {
          const cachedData = await getDataFromIDB(
            IDB,
            Number(groupId),
            new AbortController().signal,
          );
          if (cachedData && cachedData.length > 0) {
            const _data = JSON.parse(cachedData[0].data) as SpendingRecord[];
            if (_data.length > 0) {
              handleSetState(_data);
            }
          }
        } catch {
          // IDB cache miss is fine, API will provide data
        }
      }

      // Fetch from API (source of truth)
      try {
        const res = await getItems(groupId, email, startDate, endDate);
        if (res.status) {
          handleSetState(res.data);
          // Update IDB cache (always sync even for empty arrays to clear stale data)
          if (IDB) {
            const dateForCache = res.data[0]?.date ?? startDate ?? new Date().toISOString();
            await setData2IDB(IDB, res.data, groupId, dateForCache);
          }
        }
      } catch (error) {
        console.error('[SpendingProvider] Error fetching from API:', error);
      } finally {
        // Always mark initial load as done after the first API call completes,
        // regardless of whether data is empty or not, to prevent infinite re-fetch loops.
        dispatch({ type: 'SET_INITIAL_LOAD_DONE' });
      }
    },
    [IDB, getDataFromIDB, setData2IDB, handleSetState],
  );

  // Cloud-first: write to API, then update local state + IDB cache
  const addRecord = useCallback(
    async (record: SpendingRecord, groupId: string | number) => {
      const newRecord = { ...record, updated_at: new Date().toISOString() };

      // Optimistic update
      const updatedData = [...state.data, newRecord];
      handleSetState(updatedData);

      try {
        await putItem(newRecord);
        // Update IDB cache
        if (IDB) {
          await setData2IDB(IDB, updatedData, groupId, record.date);
        }
      } catch (error) {
        console.error('[SpendingProvider] Error adding record to API:', error);
        // Rollback optimistic update
        handleSetState(state.data);
      }
    },
    [IDB, state.data, handleSetState, setData2IDB],
  );

  // Cloud-first: write to API, then update local state + IDB cache
  const updateRecord = useCallback(
    async (record: SpendingRecord, groupId: string | number) => {
      const updatedRecord = { ...record, updated_at: new Date().toISOString() };
      const updatedData = state.data.map((r) =>
        r.id === record.id ? updatedRecord : r,
      );

      // Optimistic update
      handleSetState(updatedData);

      try {
        await putItem(updatedRecord);
        if (IDB) {
          await setData2IDB(IDB, updatedData, groupId, record.date);
        }
      } catch (error) {
        console.error('[SpendingProvider] Error updating record in API:', error);
        handleSetState(state.data);
      }
    },
    [IDB, state.data, handleSetState, setData2IDB],
  );

  // Cloud-first: delete from API, then update local state + IDB cache
  const deleteRecord = useCallback(
    async (recordId: string, groupId: string | number) => {
      const updatedData = state.data.filter((r) => r.id !== recordId);
      const dateStr = state.data.find((r) => r.id === recordId)?.date;

      // Optimistic update
      handleSetState(updatedData);

      try {
        await deleteItemAPI(recordId);
        if (IDB) {
          await setData2IDB(IDB, updatedData, groupId, dateStr);
        }
      } catch (error) {
        console.error('[SpendingProvider] Error deleting record from API:', error);
        handleSetState(state.data);
      }
    },
    [IDB, state.data, handleSetState, setData2IDB],
  );

  const ctxVal = useMemo(
    () => ({
      ...state,
      syncData,
      addRecord,
      updateRecord,
      deleteRecord,
    }),
    [state, syncData, addRecord, updateRecord, deleteRecord],
  );

  // Load IDB cache on mount for fast initial render
  useEffect(() => {
    const controller = (controllerRef.current = new AbortController());
    const groupId = getCookie('currentGroupId');
    if (IDB && groupId) {
      getDataFromIDB(IDB, Number(groupId), controller.signal)
        .then((res) => {
          if (res && res.length === 1) {
            const _data = JSON.parse(res[0].data) as SpendingRecord[];
            if (_data.length !== 0) {
              handleSetState(_data);
              controllerRef.current = null;
            }
          }
        })
        .catch((err) => {
          console.log('Error while reading IDB:', err);
        });
    }
    return () => controller.abort();
  }, [IDB, getDataFromIDB, handleSetState]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
