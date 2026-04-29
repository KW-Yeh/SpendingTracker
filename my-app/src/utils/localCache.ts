/**
 * Synchronous localStorage mirror of small, hot data so that React can
 * initialize state with real values on the very first render — before
 * the asynchronous IndexedDB connection is opened.
 *
 * IndexedDB remains the source of truth for the larger, indexed data
 * (transactions, all months, etc). This layer is only for the handful of
 * small payloads needed to paint the first frame.
 */

const PREFIX = 'st:';
const KEYS = {
  user: `${PREFIX}user`,
  groupsByUser: (userId: number) => `${PREFIX}groups:${userId}`,
  currentGroup: `${PREFIX}currentGroup`,
  budgetByAccount: (accountId: number) => `${PREFIX}budget:${accountId}`,
  favoritesByOwner: (ownerId: number) => `${PREFIX}favorites:${ownerId}`,
  spendingByGroup: (groupId: number | string) =>
    `${PREFIX}spending:${groupId}`,
} as const;

const isBrowser = () => typeof window !== 'undefined';

function read<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or disabled — ignore
  }
}

function remove(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

// --- User ---
export const getCachedUser = (): User | null => read<User>(KEYS.user);
export const setCachedUser = (user: User): void => write(KEYS.user, user);

// --- Groups (per user) ---
export const getCachedGroups = (userId: number): Group[] | null =>
  read<Group[]>(KEYS.groupsByUser(userId));
export const setCachedGroups = (userId: number, groups: Group[]): void =>
  write(KEYS.groupsByUser(userId), groups);

// --- Current group selection ---
export const getCachedCurrentGroup = (): Group | null =>
  read<Group>(KEYS.currentGroup);
export const setCachedCurrentGroup = (group: Group | undefined | null): void => {
  if (!group) {
    remove(KEYS.currentGroup);
    return;
  }
  write(KEYS.currentGroup, group);
};

// --- Budget (per account) ---
export const getCachedBudget = (accountId: number): Budget | null =>
  read<Budget>(KEYS.budgetByAccount(accountId));
export const setCachedBudget = (
  accountId: number,
  budget: Budget | null,
): void => {
  if (!budget) {
    remove(KEYS.budgetByAccount(accountId));
    return;
  }
  write(KEYS.budgetByAccount(accountId), budget);
};

// --- Favorite categories (per owner) ---
export const getCachedFavorites = (
  ownerId: number,
): FavoriteCategories | null =>
  read<FavoriteCategories>(KEYS.favoritesByOwner(ownerId));
export const setCachedFavorites = (
  ownerId: number,
  favorites: FavoriteCategories | null,
): void => {
  if (!favorites) {
    remove(KEYS.favoritesByOwner(ownerId));
    return;
  }
  write(KEYS.favoritesByOwner(ownerId), favorites);
};

// --- Spending (current month, per group) ---
// Stored as { year, month, data } so the consumer can decide whether the
// snapshot still applies for the month being viewed.
interface SpendingSnapshot {
  year: number;
  month: number;
  data: SpendingRecord[];
}

export const getCachedSpending = (
  groupId: number | string,
): SpendingSnapshot | null =>
  read<SpendingSnapshot>(KEYS.spendingByGroup(groupId));

export const setCachedSpending = (
  groupId: number | string,
  data: SpendingRecord[],
  date: Date = new Date(),
): void => {
  write(KEYS.spendingByGroup(groupId), {
    year: date.getFullYear(),
    month: date.getMonth(),
    data,
  });
};
