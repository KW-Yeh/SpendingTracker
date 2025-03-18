'use client';

import { useCallback, useEffect, useState } from 'react';

const DB_NAME = 'Expense Tracking';
const DB_VERSION = 1;
const STORE_NAME = 'Expense Record';

interface DATA_IDB {
  group: string;
  year: string;
  month: string;
  data: string;
}

export const useIDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('year_month', ['year', 'month'], { unique: true });
      }
    };

    openRequest.onsuccess = () => setDb(openRequest.result);
    openRequest.onerror = () =>
      console.error('Error opening IndexedDB:', openRequest.error);
  }, []);

  const setData = useCallback(
    (
      db: IDBDatabase | null,
      record: SpendingRecord[],
      time: string = new Date().toUTCString(),
    ): Promise<void> => {
      if (!db) return Promise.reject('Database not initialized');

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const year = new Date(time).getFullYear();
        const month = new Date(time).getMonth();

        const index = store.index('year_month');
        const checkRequest = index.get([year, month]);
        checkRequest.onsuccess = () => {
          if (!checkRequest.result) {
            const request = store.add({
              year,
              month,
              data: JSON.stringify(record),
            });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          }
        };
      });
    },
    [],
  );

  const getData = useCallback(
    (db: IDBDatabase | null, signal: AbortSignal): Promise<DATA_IDB[] | undefined> => {
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
            console.log('aborted');
            transaction.abort();
          }
        });

        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('year_month');
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

  return { db, setData, getData };
};
