'use client';

import { IDB_NAME, IDB_VERSION } from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';

enum StoreName {
  UserConfig = 'User Config',
  ExpenseRecord = 'Expense Record',
}

const DB_NAME = IDB_NAME;
const DB_VERSION = IDB_VERSION;
const STORE_NAME = [StoreName.UserConfig, StoreName.ExpenseRecord];
const STORE_CONFIG: Record<
  string,
  {
    indexName: string;
    indexValue: string[];
  }
> = {
  [StoreName.ExpenseRecord]: {
    indexName: 'year_month',
    indexValue: ['year', 'month'],
  },
  [StoreName.UserConfig]: {
    indexName: 'email',
    indexValue: ['email'],
  },
};

interface DATA_IDB {
  email: string;
  data: string;
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
    ): Promise<DATA_IDB | undefined> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        let isTransactionActive = true;

        transaction.oncomplete = () => {
          isTransactionActive = false;
        };

        transaction.onerror = (event) => {
          isTransactionActive = false;
          reject((event.target as IDBTransaction).error);
        };

        signal.addEventListener('abort', () => {
          if (isTransactionActive) {
            // console.log('aborted');
            transaction.abort();
          }
        });

        const store = transaction.objectStore(StoreName.UserConfig);
        const index = store.index(STORE_CONFIG[StoreName.UserConfig].indexName);
        const request = index.get([email]);

        request.onsuccess = () =>
          resolve(request.result as unknown as DATA_IDB);
        request.onerror = () => reject(request.error);

        transaction.onabort = () => reject('Transaction aborted');
      });
    },
    [],
  );

  const setSpendingData = useCallback(
    (
      db: IDBDatabase | null,
      record: SpendingRecord[],
      time: string = new Date().toISOString(),
    ): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(StoreName.ExpenseRecord);
        const year = new Date(time).getFullYear();
        const month = new Date(time).getMonth();

        const newData: {
          id?: number;
          year: number;
          month: number;
          data: string;
        } = {
          year,
          month,
          data: JSON.stringify(record),
        };

        const index = store.index(
          STORE_CONFIG[StoreName.ExpenseRecord].indexName,
        );
        const checkRequest = index.get([year, month]);
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

  const getSpendingData = useCallback(
    (
      db: IDBDatabase | null,
      signal: AbortSignal,
    ): Promise<DATA_IDB[] | undefined> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        let isTransactionActive = true;

        transaction.oncomplete = () => {
          isTransactionActive = false;
        };

        transaction.onerror = (event) => {
          isTransactionActive = false;
          reject((event.target as IDBTransaction).error);
        };

        signal.addEventListener('abort', () => {
          if (isTransactionActive) {
            // console.log('aborted');
            transaction.abort();
          }
        });

        const store = transaction.objectStore(StoreName.ExpenseRecord);
        const index = store.index(
          STORE_CONFIG[StoreName.ExpenseRecord].indexName,
        );
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const request = index.getAll([year, month]);

        request.onsuccess = () =>
          resolve(request.result as unknown as DATA_IDB[]);
        request.onerror = () => reject(request.error);

        transaction.onabort = () => reject('Transaction aborted');
      });
    },
    [],
  );

  return { db, setSpendingData, getSpendingData, setUserData, getUserData };
};
