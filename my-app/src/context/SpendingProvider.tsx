'use client';

import { useIDB } from '@/hooks/useIDB';
import { getItems } from '@/services/getRecords';
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
  data: SpendingRecord[];
  syncData: (
    groupId?: string,
    email?: string,
    startDate?: string,
    endDate?: string,
  ) => void;
} = {
  loading: true,
  data: [],
  syncData: () => {},
};

const reducer = (
  _: { data: SpendingRecord[]; loading: boolean },
  action: SpendingRecord[],
) => {
  return { data: action, loading: false };
};

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { data: [], loading: true });
  const {
    db: IDB,
    getSpendingData: getDataFromIDB,
    setSpendingData: setData2IDB,
  } = useIDB();
  const controllerRef = useRef<AbortController>(new AbortController());

  const handleSetState = useCallback((_data: SpendingRecord[]) => {
    dispatch(_data);
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
          controllerRef.current.abort();
          console.log('Get Data from API');
          handleSetState(res.data);
          setData2IDB(IDB, res.data, startDate)
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
    (
      groupId?: string,
      email?: string,
      startDate?: string,
      endDate?: string,
    ) => {
      queryItem(email, groupId, startDate, endDate);
    },
    [queryItem],
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
    if (IDB) {
      getDataFromIDB(IDB, controller.signal)
        .then((res) => {
          if (res && res.length === 1) {
            const _data = JSON.parse(res[0].data) as SpendingRecord[];
            // console.log('Get Data from IDB', _data);
            if (_data.length !== 0) {
              handleSetState(_data);
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
