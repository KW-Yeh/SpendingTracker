'use client';

import {
  getItems,
  putItem,
  deleteItem as deleteItemAPI,
} from '@/services/getRecords';
import { getCookie } from '@/utils/handleCookie';
import { getCachedSpending, setCachedSpending } from '@/utils/localCache';
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
import { toast } from 'sonner';

const INIT_CTX_VAL: {
  loading: boolean;
  isFetching: boolean;
  hasEverLoaded: boolean;
  isInitialLoad: boolean;
  data: SpendingRecord[];
  syncData: (
    groupId?: string,
    email?: string,
    startDate?: string,
    endDate?: string,
  ) => void;
  addRecord: (
    record: SpendingRecord,
    groupId: string | number,
  ) => Promise<void>;
  updateRecord: (
    record: SpendingRecord,
    groupId: string | number,
  ) => Promise<void>;
  deleteRecord: (recordId: string, groupId: string | number) => Promise<void>;
} = {
  loading: true,
  isFetching: false,
  hasEverLoaded: false,
  isInitialLoad: true,
  data: [],
  syncData: () => {},
  addRecord: async () => {},
  updateRecord: async () => {},
  deleteRecord: async () => {},
};

type State = {
  data: SpendingRecord[];
  isFetching: boolean;
  hasEverLoaded: boolean;
};

type Action =
  | { type: 'SET_DATA'; payload: SpendingRecord[] }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_END' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        hasEverLoaded: true,
      };
    case 'FETCH_START':
      return { ...state, isFetching: true };
    case 'FETCH_END':
      return { ...state, isFetching: false, hasEverLoaded: true };
    default:
      return state;
  }
};

// Synchronous warm-start from localStorage (instant — runs before first render).
function getInitialState(): State {
  if (typeof window === 'undefined') {
    return { data: [], isFetching: false, hasEverLoaded: false };
  }
  const groupId = getCookie('currentGroupId');
  if (!groupId) {
    return { data: [], isFetching: false, hasEverLoaded: false };
  }
  const snap = getCachedSpending(groupId);
  if (!snap) {
    return { data: [], isFetching: false, hasEverLoaded: false };
  }
  // Only use the snapshot if it matches the current month being viewed by
  // default (today). Other months render once the API responds.
  const now = new Date();
  if (snap.year === now.getFullYear() && snap.month === now.getMonth()) {
    return { data: snap.data, isFetching: false, hasEverLoaded: true };
  }
  return { data: [], isFetching: false, hasEverLoaded: false };
}

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  // Remember the last sync params so we can re-run them when the tab regains
  // focus / becomes visible. Without this, returning to a stale tab keeps
  // showing whatever was last fetched.
  const lastSyncArgsRef = useRef<[string?, string?, string?, string?] | null>(
    null,
  );
  // Deduplicate concurrent calls with identical params (e.g. usePrepareData +
  // page component both firing on the same group/date change).
  const inFlightKeyRef = useRef<string | null>(null);

  const handleSetState = useCallback((_data: SpendingRecord[]) => {
    dispatch({ type: 'SET_DATA', payload: _data });
  }, []);

  const syncData = useCallback(
    async (
      groupId?: string,
      email?: string,
      startDate?: string,
      endDate?: string,
    ) => {
      if (!groupId) {
        dispatch({ type: 'FETCH_END' });
        return;
      }
      // Skip if an identical fetch is already in flight (e.g. usePrepareData
      // and a page component both react to the same group/date change).
      const key = `${groupId}|${email ?? ''}|${startDate ?? ''}|${endDate ?? ''}`;
      if (inFlightKeyRef.current === key) return;
      inFlightKeyRef.current = key;

      lastSyncArgsRef.current = [groupId, email, startDate, endDate];
      dispatch({ type: 'FETCH_START' });

      const targetDate = startDate ? new Date(startDate) : new Date();
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();

      try {
        const res = await getItems(groupId, email, startDate, endDate);
        if (res.status) {
          handleSetState(res.data);
          // Mirror to localStorage when the period matches "now" — this is
          // what the next cold start will render synchronously.
          const now = new Date();
          if (year === now.getFullYear() && month === now.getMonth()) {
            setCachedSpending(groupId, res.data, now);
          }
        }
      } catch (error) {
        console.error('[SpendingProvider] Error fetching from API:', error);
      } finally {
        inFlightKeyRef.current = null;
        dispatch({ type: 'FETCH_END' });
      }
    },
    [handleSetState],
  );

  const addRecord = useCallback(
    async (record: SpendingRecord, groupId: string | number) => {
      const prevData = state.data;
      const newRecord = { ...record, updated_at: new Date().toISOString() };
      const updatedData = [...prevData, newRecord];
      handleSetState(updatedData);

      try {
        const res = await putItem(newRecord);
        if (!res.status) throw new Error(res.message);
        const now = new Date();
        const recDate = new Date(record.date);
        if (
          recDate.getFullYear() === now.getFullYear() &&
          recDate.getMonth() === now.getMonth()
        ) {
          setCachedSpending(groupId, updatedData, now);
        }
      } catch (error) {
        console.error('[SpendingProvider] Error adding record to API:', error);
        handleSetState(prevData);
        toast.error('新增失敗，請再試一次');
      }
    },
    [state.data, handleSetState],
  );

  const updateRecord = useCallback(
    async (record: SpendingRecord, groupId: string | number) => {
      const prevData = state.data;
      const updatedRecord = { ...record, updated_at: new Date().toISOString() };
      const updatedData = prevData.map((r) =>
        r.id === record.id ? updatedRecord : r,
      );
      handleSetState(updatedData);

      try {
        const res = await putItem(updatedRecord);
        if (!res.status) throw new Error(res.message);
        const now = new Date();
        const recDate = new Date(record.date);
        if (
          recDate.getFullYear() === now.getFullYear() &&
          recDate.getMonth() === now.getMonth()
        ) {
          setCachedSpending(groupId, updatedData, now);
        }
      } catch (error) {
        console.error(
          '[SpendingProvider] Error updating record in API:',
          error,
        );
        handleSetState(prevData);
        toast.error('更新失敗，請再試一次');
      }
    },
    [state.data, handleSetState],
  );

  const deleteRecord = useCallback(
    async (recordId: string, groupId: string | number) => {
      const prevData = state.data;
      const updatedData = prevData.filter((r) => r.id !== recordId);
      const dateStr = prevData.find((r) => r.id === recordId)?.date;
      handleSetState(updatedData);

      try {
        const res = await deleteItemAPI(recordId);
        if (!res.status) throw new Error(res.message);
        if (dateStr) {
          const now = new Date();
          const recDate = new Date(dateStr);
          if (
            recDate.getFullYear() === now.getFullYear() &&
            recDate.getMonth() === now.getMonth()
          ) {
            setCachedSpending(groupId, updatedData, now);
          }
        }
      } catch (error) {
        console.error(
          '[SpendingProvider] Error deleting record from API:',
          error,
        );
        handleSetState(prevData);
        toast.error('刪除失敗，請再試一次');
      }
    },
    [state.data, handleSetState],
  );

  const ctxVal = useMemo(
    () => ({
      // Backwards-compat shape:
      loading: state.isFetching && !state.hasEverLoaded,
      isInitialLoad: !state.hasEverLoaded,
      isFetching: state.isFetching,
      hasEverLoaded: state.hasEverLoaded,
      data: state.data,
      syncData,
      addRecord,
      updateRecord,
      deleteRecord,
    }),
    [state, syncData, addRecord, updateRecord, deleteRecord],
  );

  // Re-sync when the tab becomes visible again. Without this, an inactive
  // dashboard tab keeps showing stale data even after edits made elsewhere.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const args = lastSyncArgsRef.current;
      if (!args) return;
      syncData(...args);
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [syncData]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
