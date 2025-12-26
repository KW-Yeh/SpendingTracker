'use client';

import { IDB_NAME, IDB_VERSION } from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';

enum StoreName {
  UserConfig = 'User Config',
  ExpenseRecord = 'Expense Record',
  GroupData = 'Group Data',
  BudgetData = 'Budget Data',
}

const DB_NAME = IDB_NAME;
const DB_VERSION = IDB_VERSION;
const STORE_NAME = [
  StoreName.UserConfig,
  StoreName.ExpenseRecord,
  StoreName.GroupData,
  StoreName.BudgetData,
];
const STORE_CONFIG: Record<
  string,
  {
    indexName: string;
    indexValue: string[];
  }
> = {
  [StoreName.ExpenseRecord]: {
    // include group_id in the compound index so we can scope queries by group
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
};

// Generic DB record shapes used by the API below
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
  data: string; // JSON stringified Group[]
  timestamp: number; // For cache expiration
}

interface BudgetDATA_IDB {
  id?: number;
  account_id: number;
  data: string; // JSON stringified Budget
  timestamp: number; // For cache expiration
}

export const useIDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      for (const storeName of STORE_NAME) {
        if (!db.objectStoreNames.contains(storeName)) {
          console.error(`Object store ${storeName} does not exist.`);
          db.close();
          indexedDB.deleteDatabase(DB_NAME);
          window.location.reload();
          return;
        }
      }
      setDb(db);
    };

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      for (const storeName of STORE_NAME) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {
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

    openRequest.onerror = () =>
      console.error('Error opening IndexedDB:', openRequest.error);
  }, []);

  const setUserData = useCallback(
    (db: IDBDatabase | null, userData: User): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(StoreName.UserConfig);

        const newData: {
          id?: number;
          email: string;
          data: string;
        } = {
          email: userData.email,
          data: JSON.stringify(userData),
        };

        const index = store.index(STORE_CONFIG[StoreName.UserConfig].indexName);
        const checkRequest = index.get([userData.email]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) {
            newData.id = existingRecord.id;
          }
          const request = store.put(newData);
          request.onsuccess = () => resolve();
          request.onerror = () => console.error(request.error);
        };
        checkRequest.onerror = () => console.error(checkRequest.error);
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
        const transaction = db.transaction(STORE_NAME, 'readonly');
        let isTransactionActive = true;

        transaction.oncomplete = () => {
          isTransactionActive = false;
        };

        transaction.onerror = (event) => {
          isTransactionActive = false;
          console.error((event.target as IDBTransaction).error);
        };

        signal.addEventListener('abort', () => {
          if (isTransactionActive) {
            console.log('getUserData aborted');
            transaction.abort();
          }
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
          console.error(request.error);
        };

        transaction.onabort = () => console.error('Transaction aborted');
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
        const transaction = db.transaction(STORE_NAME, 'readwrite');
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
        // include groupId in the lookup key for the compound index
        // index.get may throw a DataError synchronously if the key is invalid
        try {
          const checkRequest = index.get([groupId, year, month]);
          checkRequest.onsuccess = () => {
            const existingRecord = checkRequest.result;
            if (existingRecord) {
              newData.id = existingRecord.id;
            }
            const request = store.put(newData);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          };
          checkRequest.onerror = () => reject(checkRequest.error);
        } catch (err) {
          // Fallback: scan all records and find matching group/year/month
          const allReq = store.getAll();
          allReq.onsuccess = () => {
            try {
              const all = allReq.result as unknown as SpendingDATA_IDB[];
              const existingRecord = all.find(
                (r) =>
                  r.group_id == groupId && r.year === year && r.month === month,
              );
              if (existingRecord) {
                newData.id = existingRecord.id;
              }
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
    ): Promise<SpendingDATA_IDB[] | undefined> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        let isTransactionActive = true;

        transaction.oncomplete = () => {
          isTransactionActive = false;
        };

        transaction.onerror = (event) => {
          isTransactionActive = false;
          console.error((event.target as IDBTransaction).error);
        };

        signal.addEventListener('abort', () => {
          if (isTransactionActive) {
            console.log('getUserData aborted');
            transaction.abort();
          }
        });

        const store = transaction.objectStore(StoreName.ExpenseRecord);
        const index = store.index(
          STORE_CONFIG[StoreName.ExpenseRecord].indexName,
        );
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        // include groupId in the query key so we only fetch records for that group
        const request = index.getAll([groupId, year, month]);

        request.onsuccess = () => {
          isTransactionActive = false;
          resolve(request.result as unknown as SpendingDATA_IDB[]);
        };
        request.onerror = () => {
          isTransactionActive = false;
          console.error(request.error);
        };

        transaction.onabort = () => console.error('Transaction aborted');
      });
    },
    [],
  );

  // Cache Group data
  const setGroupData = useCallback(
    (db: IDBDatabase | null, userId: number, groups: Group[]): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(StoreName.GroupData);

        const newData: GroupDATA_IDB = {
          user_id: userId,
          data: JSON.stringify(groups),
          timestamp: Date.now(),
        };

        const index = store.index(STORE_CONFIG[StoreName.GroupData].indexName);
        const checkRequest = index.get([userId]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) {
            newData.id = existingRecord.id;
          }
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
    (db: IDBDatabase | null, userId: number, maxAge: number = 5 * 60 * 1000): Promise<Group[] | null> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(StoreName.GroupData);
        const index = store.index(STORE_CONFIG[StoreName.GroupData].indexName);
        const request = index.get([userId]);

        request.onsuccess = () => {
          const result = request.result as GroupDATA_IDB | undefined;
          if (!result) {
            resolve(null);
            return;
          }

          // Check cache expiration
          if (Date.now() - result.timestamp > maxAge) {
            resolve(null); // Cache expired
            return;
          }

          try {
            const groups = JSON.parse(result.data) as Group[];
            resolve(groups);
          } catch (error) {
            reject(error);
          }
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  // Cache Budget data
  const setBudgetData = useCallback(
    (db: IDBDatabase | null, accountId: number, budget: Budget): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(StoreName.BudgetData);

        const newData: BudgetDATA_IDB = {
          account_id: accountId,
          data: JSON.stringify(budget),
          timestamp: Date.now(),
        };

        const index = store.index(STORE_CONFIG[StoreName.BudgetData].indexName);
        const checkRequest = index.get([accountId]);
        checkRequest.onsuccess = () => {
          const existingRecord = checkRequest.result;
          if (existingRecord) {
            newData.id = existingRecord.id;
          }
          const request = store.put(newData);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        };
        checkRequest.onerror = () => reject(checkRequest.error);
      });
    },
    [],
  );

  const getBudgetData = useCallback(
    (db: IDBDatabase | null, accountId: number, maxAge: number = 5 * 60 * 1000): Promise<Budget | null> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(StoreName.BudgetData);
        const index = store.index(STORE_CONFIG[StoreName.BudgetData].indexName);
        const request = index.get([accountId]);

        request.onsuccess = () => {
          const result = request.result as BudgetDATA_IDB | undefined;
          if (!result) {
            resolve(null);
            return;
          }

          // Check cache expiration
          if (Date.now() - result.timestamp > maxAge) {
            resolve(null); // Cache expired
            return;
          }

          try {
            const budget = JSON.parse(result.data) as Budget;
            resolve(budget);
          } catch (error) {
            reject(error);
          }
        };
        request.onerror = () => reject(request.error);
      });
    },
    [],
  );

  return {
    db,
    setSpendingData,
    getSpendingData,
    setUserData,
    getUserData,
    setGroupData,
    getGroupData,
    setBudgetData,
    getBudgetData,
  };
};
