'use client';

import { IDB_NAME, IDB_VERSION } from '@/utils/constants';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

enum StoreName {
  UserConfig = 'User Config',
  ExpenseRecord = 'Expense Record',
  GroupData = 'Group Data',
  BudgetData = 'Budget Data',
  FavoriteCategoriesData = 'Favorite Categories Data',
  SyncMetadata = 'Sync Metadata',
}

const DB_NAME = IDB_NAME;
const DB_VERSION = IDB_VERSION;
const STORE_NAME = [
  StoreName.UserConfig,
  StoreName.ExpenseRecord,
  StoreName.GroupData,
  StoreName.BudgetData,
  StoreName.FavoriteCategoriesData,
  StoreName.SyncMetadata,
];
const STORE_CONFIG: Record<
  string,
  {
    indexName: string;
    indexValue: string[];
  }
> = {
  [StoreName.ExpenseRecord]: {
    indexName: 'group_year_month',
    indexValue: ['group_id', 'year', 'month'],
  },
  [StoreName.UserConfig]: {
    indexName: 'email',
    indexValue: ['email'],
  },
  [StoreName.GroupData]: {
    indexName: 'user_id',
    indexValue: ['user_id'],
  },
  [StoreName.BudgetData]: {
    indexName: 'account_id',
    indexValue: ['account_id'],
  },
  [StoreName.FavoriteCategoriesData]: {
    indexName: 'owner_id',
    indexValue: ['owner_id'],
  },
  [StoreName.SyncMetadata]: {
    indexName: 'user_id',
    indexValue: ['user_id'],
  },
};

interface UserDATA_IDB {
  id?: number;
  email: string;
  data: string;
}

interface SpendingDATA_IDB {
  id?: number;
  group_id: string | number;
  year: number;
  month: number;
  data: string;
}

interface GroupDATA_IDB {
  id?: number;
  user_id: number;
  data: string;
}

interface BudgetDATA_IDB {
  id?: number;
  account_id: number;
  data: string;
}

interface FavoriteCategoriesDATA_IDB {
  id?: number;
  owner_id: number;
  data: string;
}

interface SyncMetadataDATA_IDB {
  id?: number;
  user_id: number;
  last_synced_at: string;
}

interface IDBContextValue {
  db: IDBDatabase | null;
  ready: boolean;
  setSpendingData: (
    db: IDBDatabase | null,
    record: SpendingRecord[],
    groupId: string | number,
    time?: string,
  ) => Promise<void>;
  getSpendingData: (
    db: IDBDatabase | null,
    groupId: string | number,
    signal: AbortSignal,
    year?: number,
    month?: number,
  ) => Promise<SpendingDATA_IDB[] | undefined>;
  getAllSpendingForGroup: (
    db: IDBDatabase | null,
    groupId: string | number,
  ) => Promise<SpendingDATA_IDB[]>;
  setUserData: (db: IDBDatabase | null, userData: User) => Promise<void>;
  getUserData: (
    db: IDBDatabase | null,
    email: string,
    signal: AbortSignal,
  ) => Promise<UserDATA_IDB | undefined>;
  setGroupData: (
    db: IDBDatabase | null,
    userId: number,
    groups: Group[],
  ) => Promise<void>;
  getGroupData: (
    db: IDBDatabase | null,
    userId: number,
  ) => Promise<Group[] | null>;
  setBudgetData: (
    db: IDBDatabase | null,
    accountId: number,
    budget: Budget,
  ) => Promise<void>;
  deleteBudgetData: (
    db: IDBDatabase | null,
    accountId: number,
  ) => Promise<void>;
  getBudgetData: (
    db: IDBDatabase | null,
    accountId: number,
  ) => Promise<Budget | null>;
  setFavoriteCategoriesData: (
    db: IDBDatabase | null,
    ownerId: number,
    favoriteCategories: FavoriteCategories,
  ) => Promise<void>;
  getFavoriteCategoriesData: (
    db: IDBDatabase | null,
    ownerId: number,
  ) => Promise<FavoriteCategories | null>;
  setSyncMetadata: (
    db: IDBDatabase | null,
    userId: number,
    lastSyncedAt: string,
  ) => Promise<void>;
  getSyncMetadata: (
    db: IDBDatabase | null,
    userId: number,
  ) => Promise<SyncMetadata | null>;
  getAllSpendingData: (
    db: IDBDatabase | null,
  ) => Promise<SpendingDATA_IDB[]>;
}

const noopAsync = async () => {};
const noopGet = async () => undefined;
const noopGetNull = async () => null;
const noopGetArr = async () => [];

const Ctx = createContext<IDBContextValue>({
  db: null,
  ready: false,
  setSpendingData: noopAsync,
  getSpendingData: noopGet,
  getAllSpendingForGroup: noopGetArr,
  setUserData: noopAsync,
  getUserData: noopGet,
  setGroupData: noopAsync,
  getGroupData: noopGetNull,
  setBudgetData: noopAsync,
  deleteBudgetData: noopAsync,
  getBudgetData: noopGetNull,
  setFavoriteCategoriesData: noopAsync,
  getFavoriteCategoriesData: noopGetNull,
  setSyncMetadata: noopAsync,
  getSyncMetadata: noopGetNull,
  getAllSpendingData: noopGetArr,
});

export const IDBProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onsuccess = () => {
      const opened = openRequest.result;
      for (const storeName of STORE_NAME) {
        if (!opened.objectStoreNames.contains(storeName)) {
          console.error(`Object store ${storeName} does not exist.`);
          opened.close();
          indexedDB.deleteDatabase(DB_NAME);
          window.location.reload();
          return;
        }
      }
      setDb(opened);
      setReady(true);
    };

    openRequest.onupgradeneeded = () => {
      const opened = openRequest.result;
      for (const storeName of STORE_NAME) {
        if (!opened.objectStoreNames.contains(storeName)) {
          const store = opened.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
          const config = STORE_CONFIG[storeName];
          store.createIndex(config.indexName, config.indexValue, {
            unique: true,
          });
        }
      }
    };

    openRequest.onerror = () => {
      console.error('Error opening IndexedDB:', openRequest.error);
      setReady(true);
    };
  }, []);

  const setUserData = useCallback(
    (db: IDBDatabase | null, userData: User): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.UserConfig], 'readwrite');
        const store = transaction.objectStore(StoreName.UserConfig);

        const newData: { id?: number; email: string; data: string } = {
          email: userData.email,
          data: JSON.stringify(userData),
        };

        const index = store.index(STORE_CONFIG[StoreName.UserConfig].indexName);
        const checkRequest = index.get([userData.email]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) newData.id = existingRecord.id;
          const request = store.put(newData);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        };
        checkRequest.onerror = () => reject(checkRequest.error);
      });
    },
    [],
  );

  const getUserData = useCallback(
    (
      db: IDBDatabase | null,
      email: string,
      signal: AbortSignal,
    ): Promise<UserDATA_IDB | undefined> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.UserConfig], 'readonly');
        let isTransactionActive = true;
        transaction.oncomplete = () => {
          isTransactionActive = false;
        };
        transaction.onerror = (event) => {
          isTransactionActive = false;
          console.error((event.target as IDBTransaction).error);
        };
        signal.addEventListener('abort', () => {
          if (isTransactionActive) transaction.abort();
        });

        const store = transaction.objectStore(StoreName.UserConfig);
        const index = store.index(STORE_CONFIG[StoreName.UserConfig].indexName);
        const request = index.get([email]);
        request.onsuccess = () => {
          isTransactionActive = false;
          resolve(request.result as unknown as UserDATA_IDB);
        };
        request.onerror = () => {
          isTransactionActive = false;
          reject(request.error);
        };
      });
    },
    [],
  );

  const setSpendingData = useCallback(
    (
      db: IDBDatabase | null,
      record: SpendingRecord[],
      groupId: string | number,
      time: string = new Date().toISOString(),
    ): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');
      if (groupId === undefined || groupId === null) {
        return Promise.reject('Invalid groupId');
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.ExpenseRecord],
          'readwrite',
        );
        const store = transaction.objectStore(StoreName.ExpenseRecord);
        const year = new Date(time).getFullYear();
        const month = new Date(time).getMonth();

        const newData: {
          id?: number;
          group_id: string | number;
          year: number;
          month: number;
          data: string;
        } = {
          group_id: groupId,
          year,
          month,
          data: JSON.stringify(record),
        };

        const index = store.index(
          STORE_CONFIG[StoreName.ExpenseRecord].indexName,
        );
        try {
          const checkRequest = index.get([groupId, year, month]);
          checkRequest.onsuccess = () => {
            const existingRecord = checkRequest.result;
            if (existingRecord) newData.id = existingRecord.id;
            const request = store.put(newData);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          };
          checkRequest.onerror = () => reject(checkRequest.error);
        } catch {
          // Fallback when key types mismatch (e.g. string vs number group_id)
          const allReq = store.getAll();
          allReq.onsuccess = () => {
            try {
              const all = allReq.result as unknown as SpendingDATA_IDB[];
              const existingRecord = all.find(
                (r) =>
                  r.group_id == groupId && r.year === year && r.month === month,
              );
              if (existingRecord) newData.id = existingRecord.id;
              const request = store.put(newData);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            } catch (e) {
              reject(e);
            }
          };
          allReq.onerror = () => reject(allReq.error);
        }
      });
    },
    [],
  );

  const getSpendingData = useCallback(
    (
      db: IDBDatabase | null,
      groupId: string | number,
      signal: AbortSignal,
      year?: number,
      month?: number,
    ): Promise<SpendingDATA_IDB[] | undefined> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.ExpenseRecord],
          'readonly',
        );
        let isTransactionActive = true;
        transaction.oncomplete = () => {
          isTransactionActive = false;
        };
        transaction.onerror = (event) => {
          isTransactionActive = false;
          console.error((event.target as IDBTransaction).error);
        };
        signal.addEventListener('abort', () => {
          if (isTransactionActive) transaction.abort();
        });

        const store = transaction.objectStore(StoreName.ExpenseRecord);
        const index = store.index(
          STORE_CONFIG[StoreName.ExpenseRecord].indexName,
        );
        const y = year ?? new Date().getFullYear();
        const m = month ?? new Date().getMonth();
        const request = index.getAll([groupId, y, m]);

        request.onsuccess = () => {
          isTransactionActive = false;
          resolve(request.result as unknown as SpendingDATA_IDB[]);
        };
        request.onerror = () => {
          isTransactionActive = false;
          reject(request.error);
        };
      });
    },
    [],
  );

  // Year/month-agnostic: returns ALL months cached for a group.
  const getAllSpendingForGroup = useCallback(
    (
      db: IDBDatabase | null,
      groupId: string | number,
    ): Promise<SpendingDATA_IDB[]> => {
      if (!db) return Promise.resolve([]);

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.ExpenseRecord],
          'readonly',
        );
        const store = transaction.objectStore(StoreName.ExpenseRecord);
        const request = store.getAll();
        request.onsuccess = () => {
          const all = (request.result as unknown as SpendingDATA_IDB[]) || [];
          resolve(all.filter((r) => String(r.group_id) === String(groupId)));
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  const setGroupData = useCallback(
    (db: IDBDatabase | null, userId: number, groups: Group[]): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.GroupData], 'readwrite');
        const store = transaction.objectStore(StoreName.GroupData);
        const newData: GroupDATA_IDB = {
          user_id: userId,
          data: JSON.stringify(groups),
        };
        const index = store.index(STORE_CONFIG[StoreName.GroupData].indexName);
        const checkRequest = index.get([userId]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) newData.id = existingRecord.id;
          const request = store.put(newData);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        };
        checkRequest.onerror = () => reject(checkRequest.error);
      });
    },
    [],
  );

  const getGroupData = useCallback(
    (db: IDBDatabase | null, userId: number): Promise<Group[] | null> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.GroupData], 'readonly');
        const store = transaction.objectStore(StoreName.GroupData);
        const index = store.index(STORE_CONFIG[StoreName.GroupData].indexName);
        const request = index.get([userId]);
        request.onsuccess = () => {
          const result = request.result as GroupDATA_IDB | undefined;
          if (!result) {
            resolve(null);
            return;
          }
          try {
            resolve(JSON.parse(result.data) as Group[]);
          } catch (error) {
            reject(error);
          }
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  const setBudgetData = useCallback(
    (
      db: IDBDatabase | null,
      accountId: number,
      budget: Budget,
    ): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.BudgetData], 'readwrite');
        const store = transaction.objectStore(StoreName.BudgetData);
        const newData: BudgetDATA_IDB = {
          account_id: accountId,
          data: JSON.stringify(budget),
        };
        const index = store.index(STORE_CONFIG[StoreName.BudgetData].indexName);
        const checkRequest = index.get([accountId]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) newData.id = existingRecord.id;
          const request = store.put(newData);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        };
        checkRequest.onerror = () => reject(checkRequest.error);
      });
    },
    [],
  );

  const deleteBudgetData = useCallback(
    (db: IDBDatabase | null, accountId: number): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.BudgetData], 'readwrite');
        const store = transaction.objectStore(StoreName.BudgetData);
        const index = store.index(STORE_CONFIG[StoreName.BudgetData].indexName);
        const checkRequest = index.get([accountId]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result as
            | BudgetDATA_IDB
            | undefined;
          if (!existingRecord) {
            resolve();
            return;
          }
          const deleteRequest = store.delete(existingRecord.id!);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        };
        checkRequest.onerror = () => reject(checkRequest.error);
      });
    },
    [],
  );

  const getBudgetData = useCallback(
    (db: IDBDatabase | null, accountId: number): Promise<Budget | null> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.BudgetData], 'readonly');
        const store = transaction.objectStore(StoreName.BudgetData);
        const index = store.index(STORE_CONFIG[StoreName.BudgetData].indexName);
        const request = index.get([accountId]);
        request.onsuccess = () => {
          const result = request.result as BudgetDATA_IDB | undefined;
          if (!result) {
            resolve(null);
            return;
          }
          try {
            resolve(JSON.parse(result.data) as Budget);
          } catch (error) {
            reject(error);
          }
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  const setFavoriteCategoriesData = useCallback(
    (
      db: IDBDatabase | null,
      ownerId: number,
      favoriteCategories: FavoriteCategories,
    ): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.FavoriteCategoriesData],
          'readwrite',
        );
        const store = transaction.objectStore(StoreName.FavoriteCategoriesData);
        const newData: FavoriteCategoriesDATA_IDB = {
          owner_id: ownerId,
          data: JSON.stringify(favoriteCategories),
        };
        const index = store.index(
          STORE_CONFIG[StoreName.FavoriteCategoriesData].indexName,
        );
        const checkRequest = index.get([ownerId]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) newData.id = existingRecord.id;
          const request = store.put(newData);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        };
        checkRequest.onerror = () => reject(checkRequest.error);
      });
    },
    [],
  );

  const getFavoriteCategoriesData = useCallback(
    (
      db: IDBDatabase | null,
      ownerId: number,
    ): Promise<FavoriteCategories | null> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.FavoriteCategoriesData],
          'readonly',
        );
        const store = transaction.objectStore(StoreName.FavoriteCategoriesData);
        const index = store.index(
          STORE_CONFIG[StoreName.FavoriteCategoriesData].indexName,
        );
        const request = index.get([ownerId]);
        request.onsuccess = () => {
          const result = request.result as
            | FavoriteCategoriesDATA_IDB
            | undefined;
          if (!result) {
            resolve(null);
            return;
          }
          try {
            resolve(JSON.parse(result.data) as FavoriteCategories);
          } catch (error) {
            reject(error);
          }
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  const setSyncMetadata = useCallback(
    (
      db: IDBDatabase | null,
      userId: number,
      lastSyncedAt: string,
    ): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.SyncMetadata],
          'readwrite',
        );
        const store = transaction.objectStore(StoreName.SyncMetadata);
        const newData: SyncMetadataDATA_IDB = {
          user_id: userId,
          last_synced_at: lastSyncedAt,
        };
        const index = store.index(
          STORE_CONFIG[StoreName.SyncMetadata].indexName,
        );
        const checkRequest = index.get([userId]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) newData.id = existingRecord.id;
          const request = store.put(newData);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        };
        checkRequest.onerror = () => reject(checkRequest.error);
      });
    },
    [],
  );

  const getSyncMetadata = useCallback(
    (
      db: IDBDatabase | null,
      userId: number,
    ): Promise<SyncMetadata | null> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.SyncMetadata],
          'readonly',
        );
        const store = transaction.objectStore(StoreName.SyncMetadata);
        const index = store.index(
          STORE_CONFIG[StoreName.SyncMetadata].indexName,
        );
        const request = index.get([userId]);
        request.onsuccess = () => {
          const result = request.result as SyncMetadataDATA_IDB | undefined;
          if (!result) {
            resolve(null);
            return;
          }
          resolve({
            user_id: result.user_id,
            last_synced_at: result.last_synced_at,
          });
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  const getAllSpendingData = useCallback(
    (db: IDBDatabase | null): Promise<SpendingDATA_IDB[]> => {
      if (!db) return Promise.reject('Database not initialized');
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(
          [StoreName.ExpenseRecord],
          'readonly',
        );
        const store = transaction.objectStore(StoreName.ExpenseRecord);
        const request = store.getAll();
        request.onsuccess = () => {
          resolve(request.result as unknown as SpendingDATA_IDB[]);
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  const value = useMemo<IDBContextValue>(
    () => ({
      db,
      ready,
      setSpendingData,
      getSpendingData,
      getAllSpendingForGroup,
      setUserData,
      getUserData,
      setGroupData,
      getGroupData,
      setBudgetData,
      deleteBudgetData,
      getBudgetData,
      setFavoriteCategoriesData,
      getFavoriteCategoriesData,
      setSyncMetadata,
      getSyncMetadata,
      getAllSpendingData,
    }),
    [
      db,
      ready,
      setSpendingData,
      getSpendingData,
      getAllSpendingForGroup,
      setUserData,
      getUserData,
      setGroupData,
      getGroupData,
      setBudgetData,
      deleteBudgetData,
      getBudgetData,
      setFavoriteCategoriesData,
      getFavoriteCategoriesData,
      setSyncMetadata,
      getSyncMetadata,
      getAllSpendingData,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useIDBCtx = () => useContext(Ctx);
