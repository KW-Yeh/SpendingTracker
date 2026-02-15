'use client';

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

  // IDB-only: read favorites from IDB
  const syncFavorites = useCallback(
    async (ownerId: number) => {
      if (!db) {
        setLoading(true);
        return;
      }

      try {
        const cachedData = await getFavoriteCategoriesData(db, ownerId);
        if (cachedData) {
          startTransition(() => {
            setFavorites(cachedData);
            setLoading(false);
          });
        } else {
          handleState(null);
        }
      } catch (error) {
        console.error('[FavoriteCategoriesProvider] Error reading IDB:', error);
        handleState(null);
      }
    },
    [db, getFavoriteCategoriesData, handleState],
  );

  // IDB-only: write favorites to IDB + update state
  const updateFavorites = useCallback(
    async (data: Partial<FavoriteCategories> & { owner_id: number }) => {
      setLoading(true);

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

      if (db) {
        await setFavoriteCategoriesData(db, data.owner_id, updatedFavorites);
      }
      handleState(updatedFavorites);
    },
    [db, favorites, setFavoriteCategoriesData, handleState],
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
