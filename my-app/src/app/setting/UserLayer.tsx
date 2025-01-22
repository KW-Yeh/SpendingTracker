'use client';

import { useUserConfigCtx } from '@/context/UserConfigProvider';

export const UserLayer = () => {
  const { config: userData } = useUserConfigCtx();
  if (!userData) return null;
  return (
    <div className="flex w-80 flex-col divide-y divide-gray-300 rounded-3xl border border-solid border-gray-300 p-4"></div>
  );
};
