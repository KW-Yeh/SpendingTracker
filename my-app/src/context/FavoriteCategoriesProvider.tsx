'use client';

import {
  getCategoryFavorites,
  updateCategoryFavorites,
} from '@/utils/categoryHelpers';
import {
  getFavoriteCategories,
  putFavoriteCategories,
} from '@/services/favoriteCategoriesServices';
import { getCachedFavorites, setCachedFavorites } from '@/utils/localCache';
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
  isFetching: boolean;
  hasEverLoaded: boolean;
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
  isFetching: false,
  hasEverLoaded: false,
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
  const [favorites, setFavorites] = useState<FavoriteCategories | null>(null);
  const [hasEverLoaded, setHasEverLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleState = useCallback(
    (data: FavoriteCategories | null, ownerId?: number) => {
      setFavorites(data);
      setHasEverLoaded(true);
      if (ownerId) setCachedFavorites(ownerId, data);
    },
    [],
  );

  const syncFavorites = useCallback(
    async (ownerId: number) => {
      setIsFetching(true);

      // Synchronous LS hit
      const ls = getCachedFavorites(ownerId);
      if (ls) {
        startTransition(() => handleState(ls, ownerId));
      }

      try {
        const res = await getFavoriteCategories(ownerId);
        if (res.status) {
          handleState(res.data, ownerId);
        }
      } catch (error) {
        console.error(
          '[FavoriteCategoriesProvider] Error fetching from API:',
          error,
        );
      } finally {
        setIsFetching(false);
        setHasEverLoaded(true);
      }
    },
    [handleState],
  );

  const updateFavorites = useCallback(
    async (data: Partial<FavoriteCategories> & { owner_id: number }) => {
      setIsFetching(true);
      const updatedFavorites: FavoriteCategories = {
        category_id: favorites?.category_id || Date.now(),
        owner_id: data.owner_id,
        food: data.food ?? favorites?.food,
        clothing: data.clothing ?? favorites?.clothing,
        housing: data.housing ?? favorites?.housing,
        transportation: data.transportation ?? favorites?.transportation,
        education: data.education ?? favorites?.education,
        entertainment: data.entertainment ?? favorites?.entertainment,
        daily: data.daily ?? favorites?.daily,
        medical: data.medical ?? favorites?.medical,
        investment: data.investment ?? favorites?.investment,
        other: data.other ?? favorites?.other,
        salary: data.salary ?? favorites?.salary,
        bonus: data.bonus ?? favorites?.bonus,
        updated_at: new Date().toISOString(),
      };

      try {
        const res = await putFavoriteCategories(updatedFavorites);
        if (res.status && res.data) {
          handleState(res.data, data.owner_id);
        } else {
          handleState(updatedFavorites, data.owner_id);
        }
      } catch (error) {
        console.error(
          '[FavoriteCategoriesProvider] Error updating API:',
          error,
        );
        handleState(updatedFavorites, data.owner_id);
      } finally {
        setIsFetching(false);
      }
    },
    [favorites, handleState],
  );

  const getCategoryDescriptions = useCallback(
    (categoryEmoji: string): string[] =>
      getCategoryFavorites(favorites, categoryEmoji),
    [favorites],
  );

  const addCategoryDescription = useCallback(
    async (categoryEmoji: string, description: string, ownerId: number) => {
      const current = getCategoryFavorites(favorites, categoryEmoji);
      if (current.includes(description)) return;
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
      loading: !hasEverLoaded,
      isFetching,
      hasEverLoaded,
      favorites,
      syncFavorites,
      updateFavorites,
      getCategoryDescriptions,
      addCategoryDescription,
      removeCategoryDescription,
    }),
    [
      hasEverLoaded,
      isFetching,
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
