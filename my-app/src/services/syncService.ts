'use client';

/**
 * Sync Service — handles pull (cloud→IDB) and push (IDB→cloud) logic
 * with timestamp-based merge (newer record wins).
 *
 * Transactions: keep recent 3 months; older data is treated as temp (overwritten on pull).
 */

type IDBMethods = {
  setUserData: (db: IDBDatabase, userData: User) => Promise<void>;
  getUserData: (db: IDBDatabase, email: string, signal: AbortSignal) => Promise<{ data: string } | undefined>;
  setGroupData: (db: IDBDatabase, userId: number, groups: Group[]) => Promise<void>;
  getGroupData: (db: IDBDatabase, userId: number) => Promise<Group[] | null>;
  setSpendingData: (db: IDBDatabase, records: SpendingRecord[], groupId: string | number, time?: string) => Promise<void>;
  getAllSpendingData: (db: IDBDatabase) => Promise<{ group_id: string | number; year: number; month: number; data: string }[]>;
  setBudgetData: (db: IDBDatabase, accountId: number, budget: Budget) => Promise<void>;
  getBudgetData: (db: IDBDatabase, accountId: number) => Promise<Budget | null>;
  setFavoriteCategoriesData: (db: IDBDatabase, ownerId: number, data: FavoriteCategories) => Promise<void>;
  getFavoriteCategoriesData: (db: IDBDatabase, ownerId: number) => Promise<FavoriteCategories | null>;
  setSyncMetadata: (db: IDBDatabase, userId: number, lastSyncedAt: string) => Promise<void>;
  getSyncMetadata: (db: IDBDatabase, userId: number) => Promise<SyncMetadata | null>;
};

/**
 * Check if a year/month is within recent 3 months from now
 */
function isRecentThreeMonths(year: number, month: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Calculate months difference
  const diff = (currentYear - year) * 12 + (currentMonth - month);
  return diff >= 0 && diff < 3;
}

/**
 * Merge two arrays of SpendingRecords by id, keeping the newer one (by updated_at)
 */
function mergeTransactions(
  local: SpendingRecord[],
  remote: SpendingRecord[],
): SpendingRecord[] {
  const map = new Map<string, SpendingRecord>();

  // Add local records first
  for (const record of local) {
    map.set(record.id, record);
  }

  // Merge remote records: overwrite if remote is newer or local has no updated_at
  for (const record of remote) {
    const existing = map.get(record.id);
    if (!existing) {
      map.set(record.id, record);
    } else {
      const localTime = existing.updated_at ? new Date(existing.updated_at).getTime() : 0;
      const remoteTime = record.updated_at ? new Date(record.updated_at).getTime() : 0;
      if (remoteTime >= localTime) {
        map.set(record.id, record);
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Main sync function: Pull then Push
 */
export async function syncAll(
  db: IDBDatabase,
  userId: number,
  userEmail: string,
  idb: IDBMethods,
  onProgress?: (progress: SyncProgress) => void,
): Promise<void> {
  const totalSteps = 10; // 5 pull + 5 push
  let currentStep = 0;

  const reportProgress = (step: 'pull' | 'push', entity: string) => {
    currentStep++;
    onProgress?.({ step, entity, current: currentStep, total: totalSteps });
  };

  // --- PULL PHASE ---

  // 1. Get last_synced_at
  const syncMeta = await idb.getSyncMetadata(db, userId);
  const since = syncMeta?.last_synced_at || '1970-01-01T00:00:00.000Z';

  // 2. Fetch all data from cloud
  const response = await fetch(
    `/api/aurora/sync?user_id=${userId}&since=${encodeURIComponent(since)}`,
  );
  if (!response.ok) {
    throw new Error(`Pull failed: ${response.statusText}`);
  }
  const pullData: SyncPullResponse = await response.json();

  // 3. Merge user data
  reportProgress('pull', 'user');
  if (pullData.user) {
    const signal = new AbortController().signal;
    const localUserRaw = await idb.getUserData(db, userEmail, signal);
    const localUser: User | null = localUserRaw ? JSON.parse(localUserRaw.data) : null;

    if (!localUser) {
      await idb.setUserData(db, pullData.user);
    } else {
      const localTime = localUser.updated_at ? new Date(localUser.updated_at).getTime() : 0;
      const remoteTime = pullData.user.updated_at ? new Date(pullData.user.updated_at).getTime() : 0;
      if (remoteTime >= localTime) {
        await idb.setUserData(db, pullData.user);
      }
    }
  }

  // 4. Merge groups
  reportProgress('pull', 'groups');
  if (pullData.groups.length > 0) {
    const localGroups = await idb.getGroupData(db, userId);
    const localGroupMap = new Map<number, Group>();
    if (localGroups) {
      for (const g of localGroups) {
        if (g.account_id) localGroupMap.set(g.account_id, g);
      }
    }

    // Merge: remote wins if newer
    for (const remoteGroup of pullData.groups) {
      if (!remoteGroup.account_id) continue;
      const local = localGroupMap.get(remoteGroup.account_id);
      if (!local) {
        localGroupMap.set(remoteGroup.account_id, remoteGroup);
      } else {
        const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0;
        const remoteTime = remoteGroup.updated_at ? new Date(remoteGroup.updated_at).getTime() : 0;
        if (remoteTime >= localTime) {
          localGroupMap.set(remoteGroup.account_id, remoteGroup);
        }
      }
    }

    await idb.setGroupData(db, userId, Array.from(localGroupMap.values()));
  }

  // 5. Merge transactions
  reportProgress('pull', 'transactions');
  for (const [key, remoteRecords] of Object.entries(pullData.transactions)) {
    const [groupIdStr, yearStr, monthStr] = key.split('_');
    const groupId = Number(groupIdStr);
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (isRecentThreeMonths(year, month)) {
      // For recent 3 months: merge by timestamp
      // Get local data for this group/year/month
      const allLocal = await idb.getAllSpendingData(db);
      const localChunk = allLocal.find(
        (r) => Number(r.group_id) === groupId && r.year === year && r.month === month,
      );
      const localRecords: SpendingRecord[] = localChunk
        ? JSON.parse(localChunk.data)
        : [];

      const merged = mergeTransactions(localRecords, remoteRecords);
      // Build a date string for the first day of the month to pass as time
      const dateStr = new Date(year, month, 1).toISOString();
      await idb.setSpendingData(db, merged, groupId, dateStr);
    } else {
      // Older than 3 months: overwrite (temp data)
      const dateStr = new Date(year, month, 1).toISOString();
      await idb.setSpendingData(db, remoteRecords, groupId, dateStr);
    }
  }

  // 6. Merge budgets
  reportProgress('pull', 'budgets');
  for (const remoteBudget of pullData.budgets) {
    const localBudget = await idb.getBudgetData(db, remoteBudget.account_id);
    if (!localBudget) {
      await idb.setBudgetData(db, remoteBudget.account_id, remoteBudget);
    } else {
      const localTime = localBudget.updated_at ? new Date(localBudget.updated_at).getTime() : 0;
      const remoteTime = remoteBudget.updated_at ? new Date(remoteBudget.updated_at).getTime() : 0;
      if (remoteTime >= localTime) {
        await idb.setBudgetData(db, remoteBudget.account_id, remoteBudget);
      }
    }
  }

  // 7. Merge favorite categories
  reportProgress('pull', 'favorites');
  if (pullData.favorites) {
    const localFav = await idb.getFavoriteCategoriesData(db, userId);
    if (!localFav) {
      await idb.setFavoriteCategoriesData(db, userId, pullData.favorites);
    } else {
      const localTime = localFav.updated_at ? new Date(localFav.updated_at).getTime() : 0;
      const remoteTime = pullData.favorites.updated_at
        ? new Date(pullData.favorites.updated_at).getTime()
        : 0;
      if (remoteTime >= localTime) {
        await idb.setFavoriteCategoriesData(db, userId, pullData.favorites);
      }
    }
  }

  // --- PUSH PHASE ---

  // 8. Read user from IDB
  reportProgress('push', 'user');
  const signal = new AbortController().signal;
  const userRaw = await idb.getUserData(db, userEmail, signal);
  const user: User | null = userRaw ? JSON.parse(userRaw.data) : null;

  if (!user) {
    throw new Error('No user data in IDB to push');
  }

  // 9. Read all spending data from IDB (recent 3 months only)
  reportProgress('push', 'transactions');
  const allSpending = await idb.getAllSpendingData(db);
  const transactionsToPush: SpendingRecord[] = [];
  for (const chunk of allSpending) {
    if (isRecentThreeMonths(chunk.year, chunk.month)) {
      const records: SpendingRecord[] = JSON.parse(chunk.data);
      transactionsToPush.push(...records);
    }
  }

  // 10. Read budgets from IDB
  reportProgress('push', 'budgets');
  const groups = await idb.getGroupData(db, userId);
  const budgetsToPush: Budget[] = [];
  if (groups) {
    for (const group of groups) {
      if (group.account_id) {
        const budget = await idb.getBudgetData(db, group.account_id);
        if (budget) {
          budgetsToPush.push(budget);
        }
      }
    }
  }

  // 11. Read favorites from IDB
  reportProgress('push', 'favorites');
  const favorites = await idb.getFavoriteCategoriesData(db, userId);

  // 12. Push to cloud
  reportProgress('push', 'uploading');
  const pushPayload: SyncPushPayload = {
    user,
    transactions: transactionsToPush,
    budgets: budgetsToPush,
    favorites,
  };

  const pushResponse = await fetch('/api/aurora/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pushPayload),
  });

  if (!pushResponse.ok) {
    throw new Error(`Push failed: ${pushResponse.statusText}`);
  }

  // 13. Update last_synced_at
  await idb.setSyncMetadata(db, userId, new Date().toISOString());
}
