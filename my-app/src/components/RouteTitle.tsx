'use client';

import { useRoleCtx } from '@/context/UserRoleProvider';
import { PAGE_TITLE } from '@/utils/constants';
import { usePathname } from 'next/navigation';

export const RouteTitle = () => {
  const pathName = usePathname();
  const { group: selectedGroup } = useRoleCtx();
  return (
    <h1 className="text-center text-lg font-bold sm:text-xl">
      {PAGE_TITLE[pathName]}
      {selectedGroup && (
        <span className="ml-1">
          (
          <span className="clipped-text gradient-r-from-purple-to-blue">
            {selectedGroup.name}
          </span>
          )
        </span>
      )}
    </h1>
  );
};
