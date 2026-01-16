'use client';

import {
  getFavoriteCategories,
  putFavoriteCategories,
} from '@/services/favoriteCategoriesServices';
import {
  getCategoryFavorites,
  updateCategoryFavorites,
} from '@/utils/categoryHelpers';
import { useIDB } from '@/hooks/useIDB';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  startTransition,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  favorites: FavoriteCategories | null;
  syncFavorites: (ownerId: number) => void;
  updateFavorites: (
    data: Partial<FavoriteCategories> & { owner_id: number },
  ) => Promise<void>;
  getCategoryDescriptions: (categoryEmoji: string) => string[];
  addCategoryDescription: (
    categoryEmoji: string,
    description: string,
    ownerId: number,
  ) => Promise<void>;
  removeCategoryDescription: (
    categoryEmoji: string,
    description: string,
    ownerId: number,
  ) => Promise<void>;
} = {
  loading: true,
  favorites: null,
  syncFavorites: () => {},
  updateFavorites: async () => {},
  getCategoryDescriptions: () => [],
  addCategoryDescription: async () => {},
  removeCategoryDescription: async () => {},
};

export const FavoriteCategoriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteCategories | null>(null);
  const { db, getFavoriteCategoriesData, setFavoriteCategoriesData } = useIDB();

  const handleState = useCallback((data: FavoriteCategories | null) => {
    setFavorites(data);
    setLoading(false);
  }, []);

  // Stale-While-Revalidate strategy for favorite categories
  const syncFavorites = useCallback(
    async (ownerId: number) => {
      if (!db) {
        // Fallback to direct API call
        setLoading(true);
        getFavoriteCategories(ownerId)
          .then((res) => {
            if (res.status) {
              handleState(res.data);
            } else {
              handleState(null);
            }
          })
          .catch((err) => {
            console.error(err);
            handleState(null);
          });
        return;
      }

      // Try cache first
      try {
        const cachedData = await getFavoriteCategoriesData(db, ownerId);
        if (cachedData) {
          console.log('[FavoriteCategoriesProvider] Using cached favorite categories data');
          startTransition(() => {
            setFavorites(cachedData);
            setLoading(false);
          });
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.error('[FavoriteCategoriesProvider] Error reading cache:', error);
        setLoading(true);
      }

      // Revalidate in background
      getFavoriteCategories(ownerId)
        .then((res) => {
          if (res.status && res.data) {
            startTransition(() => {
              handleState(res.data);
            });
            // Update cache
            setFavoriteCategoriesData(db, ownerId, res.data).catch(console.error);
          } else {
            handleState(null);
          }
        })
        .catch((err) => {
          console.error(err);
          handleState(null);
        });
    },
    [db, getFavoriteCategoriesData, setFavoriteCategoriesData, handleState],
  );

  const updateFavorites = useCallback(
    async (data: Partial<FavoriteCategories> & { owner_id: number }) => {
      setLoading(true);
      const res = await putFavoriteCategories(data);
      if (res.status && res.data) {
        handleState(res.data);
        // Update cache
        if (db) {
          setFavoriteCategoriesData(db, data.owner_id, res.data).catch(console.error);
        }
      } else {
        setLoading(false);
      }
    },
    [db, setFavoriteCategoriesData, handleState],
  );

  const getCategoryDescriptions = useCallback(
    (categoryEmoji: string): string[] => {
      return getCategoryFavorites(favorites, categoryEmoji);
    },
    [favorites],
  );

  const addCategoryDescription = useCallback(
    async (categoryEmoji: string, description: string, ownerId: number) => {
      const current = getCategoryFavorites(favorites, categoryEmoji);
      if (current.includes(description)) return; // Already exists

      const updated = [...current, description];
      const patch = updateCategoryFavorites(favorites, categoryEmoji, updated);

      await updateFavorites({ owner_id: ownerId, ...patch });
    },
    [favorites, updateFavorites],
  );

  const removeCategoryDescription = useCallback(
    async (categoryEmoji: string, description: string, ownerId: number) => {
      const current = getCategoryFavorites(favorites, categoryEmoji);
      const updated = current.filter((d) => d !== description);
      const patch = updateCategoryFavorites(favorites, categoryEmoji, updated);

      await updateFavorites({ owner_id: ownerId, ...patch });
    },
    [favorites, updateFavorites],
  );

  const ctxVal = useMemo(
    () => ({
      loading,
      favorites,
      syncFavorites,
      updateFavorites,
      getCategoryDescriptions,
      addCategoryDescription,
      removeCategoryDescription,
    }),
    [
      loading,
      favorites,
      syncFavorites,
      updateFavorites,
      getCategoryDescriptions,
      addCategoryDescription,
      removeCategoryDescription,
    ],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useFavoriteCategoriesCtx = () => useContext(Ctx);
