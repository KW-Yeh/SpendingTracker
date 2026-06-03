'use client';

import { useBudgetCtx } from '@/context/BudgetProvider';
import { useFavoriteCategoriesCtx } from '@/context/FavoriteCategoriesProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useEffect } from 'react';
import { toast } from 'sonner';

const TOAST_ID = 'data-syncing';

/**
 * Global loading indicator: while any data context is fetching from the API,
 * show a single "資料更新中" toast sliding in at the top-center of the screen
 * (the <Toaster /> in layout.tsx is positioned top-center).
 */
export const DataSyncToast = () => {
  const { isFetching: isFetchingSpending } = useGetSpendingCtx();
  const { isFetching: isFetchingGroups } = useGroupCtx();
  const { isFetching: isFetchingBudget } = useBudgetCtx();
  const { isFetching: isFetchingUser } = useUserConfigCtx();
  const { isFetching: isFetchingFavorites } = useFavoriteCategoriesCtx();

  const isSyncing =
    isFetchingSpending ||
    isFetchingGroups ||
    isFetchingBudget ||
    isFetchingUser ||
    isFetchingFavorites;

  useEffect(() => {
    if (isSyncing) {
      toast.loading('資料更新中…', { id: TOAST_ID });
    } else {
      toast.dismiss(TOAST_ID);
    }
  }, [isSyncing]);

  // Make sure the toast never outlives the component.
  useEffect(
    () => () => {
      toast.dismiss(TOAST_ID);
    },
    [],
  );

  return null;
};
