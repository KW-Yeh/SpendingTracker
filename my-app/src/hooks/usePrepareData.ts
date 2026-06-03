'use client';

import { useFavoriteCategoriesCtx } from '@/context/FavoriteCategoriesProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { getCookie } from '@/utils/handleCookie';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export const usePrepareData = () => {
  const { syncGroup, groups, setCurrentGroup, currentGroup } = useGroupCtx();
  const { config: userData, syncUser } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();
  const { syncFavorites } = useFavoriteCategoriesCtx();
  const { data: session } = useSession();

  // Prefer the JWT-resolved userId so we can fan out API calls before the
  // full user object comes back.
  const sessionUserId = (session?.user as { userId?: number } | undefined)
    ?.userId;
  const effectiveUserId = sessionUserId ?? userData?.user_id;

  const hasSyncedUser = useRef(false);
  useEffect(() => {
    if (!hasSyncedUser.current) {
      hasSyncedUser.current = true;
      syncUser();
    }
  }, [syncUser]);

  // Fan-out: as soon as we know the userId (often instantly from JWT), kick
  // off groups + favorites sync in parallel — no waiting on user fetch.
  useEffect(() => {
    if (effectiveUserId) {
      syncGroup(effectiveUserId);
      syncFavorites(effectiveUserId);
    }
  }, [effectiveUserId, syncGroup, syncFavorites]);

  // Resolve currentGroup from cookie or default once groups land.
  useEffect(() => {
    if (groups.length > 0 && !currentGroup) {
      const currentGroupId = getCookie('currentGroupId') || '';
      const defaultGroup =
        groups.find((group) => String(group.account_id) === currentGroupId) ??
        groups
          .slice()
          .sort(
            (a, b) =>
              (a.created_at ? new Date(a.created_at).getTime() : 0) -
              (b.created_at ? new Date(b.created_at).getTime() : 0),
          )[0];
      setCurrentGroup(defaultGroup);
    }
  }, [groups, setCurrentGroup, currentGroup]);

  // Sync current month spending whenever currentGroup changes.
  useEffect(() => {
    if (currentGroup?.account_id) {
      const { startDate, endDate } = getStartEndOfMonth(new Date());
      syncData(
        String(currentGroup.account_id),
        undefined,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    }
  }, [syncData, currentGroup?.account_id]);
};
