'use client';

import { SpendingItem } from '@/app/insert/SpendingItem';
import { SearchIcon } from '@/components/icons/SearchIcon';

interface Props {
  data: SpendingRecord[];
  loading: boolean;
  refreshData: () => void;
}

export const SpendingList = (props: Props) => {
  const { refreshData, data, loading } = props;

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-1 text-xs sm:text-sm">
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
      </div>
    );
  } else if (data.length === 0) {
    return (
      <div className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-2 text-xs sm:h-14 sm:text-sm">
        <SearchIcon className="size-5 text-gray-700" />
        <span className="text-gray-700">找不到資料</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 text-xs sm:text-sm">
      {data.map((spending, index) => (
        <SpendingItem
          key={`${spending.id}-${index.toString()}`}
          spending={spending}
          refreshData={refreshData}
        />
      ))}
    </div>
  );
};
