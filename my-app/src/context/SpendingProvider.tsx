'use client';

import { useIDB } from '@/hooks/useIDB';
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
  | { type: 'SET_LOADING'; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        loading: false,
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

  // IDB-only: read spending data from IDB
  const syncData = useCallback(
    async (
      groupId?: string,
      email?: string,
      startDate?: string,
      endDate?: string,
    ) => {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (!groupId || !IDB) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const cachedData = await getDataFromIDB(
          IDB,
          Number(groupId),
          new AbortController().signal,
        );
        if (cachedData && cachedData.length > 0) {
          const _data = JSON.parse(cachedData[0].data) as SpendingRecord[];
          handleSetState(_data);
        } else {
          handleSetState([]);
        }
      } catch (error) {
        console.error('[SpendingProvider] Error reading IDB:', error);
        handleSetState([]);
      }
    },
    [IDB, getDataFromIDB, handleSetState],
  );

  // IDB-only: add a new spending record
  const addRecord = useCallback(
    async (record: SpendingRecord, groupId: string | number) => {
      const newRecord = { ...record, updated_at: new Date().toISOString() };
      const updatedData = [...state.data, newRecord];
      handleSetState(updatedData);

      if (IDB) {
        await setData2IDB(IDB, updatedData, groupId, record.date);
      }
    },
    [IDB, state.data, handleSetState, setData2IDB],
  );

  // IDB-only: update an existing spending record
  const updateRecord = useCallback(
    async (record: SpendingRecord, groupId: string | number) => {
      const updatedRecord = { ...record, updated_at: new Date().toISOString() };
      const updatedData = state.data.map((r) =>
        r.id === record.id ? updatedRecord : r,
      );
      handleSetState(updatedData);

      if (IDB) {
        await setData2IDB(IDB, updatedData, groupId, record.date);
      }
    },
    [IDB, state.data, handleSetState, setData2IDB],
  );

  // IDB-only: delete a spending record
  const deleteRecord = useCallback(
    async (recordId: string, groupId: string | number) => {
      const updatedData = state.data.filter((r) => r.id !== recordId);
      handleSetState(updatedData);

      if (IDB) {
        const dateStr = state.data.find((r) => r.id === recordId)?.date;
        await setData2IDB(IDB, updatedData, groupId, dateStr);
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

  // Load data from IDB on mount
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
