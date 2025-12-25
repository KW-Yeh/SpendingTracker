'use client';

import {
  getFavoriteCategories,
  putFavoriteCategories,
} from '@/services/favoriteCategoriesServices';
import {
  getCategoryFavorites,
  updateCategoryFavorites,
} from '@/utils/categoryHelpers';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
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

  const handleState = useCallback((data: FavoriteCategories | null) => {
    setFavorites(data);
    setLoading(false);
  }, []);

  const syncFavorites = useCallback(
    (ownerId: number) => {
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
    },
    [handleState],
  );

  const updateFavorites = useCallback(
    async (data: Partial<FavoriteCategories> & { owner_id: number }) => {
      setLoading(true);
      const res = await putFavoriteCategories(data);
      if (res.status && res.data) {
        handleState(res.data);
      } else {
        setLoading(false);
      }
    },
    [handleState],
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
