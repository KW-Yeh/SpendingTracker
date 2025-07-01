'use client';

import { SpendingItem } from '@/app/insert/SpendingItem';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { formatDate } from '@/utils/formatDate';
import { useMemo } from 'react';

interface Props {
  data: SpendingRecord[];
  filterStr: string;
  loading: boolean;
  refreshData: () => void;
}

export const SpendingList = (props: Props) => {
  const { refreshData, data, filterStr, loading } = props;

  const filteredBySearch = useMemo(
    () =>
      data.filter((d) => filterStr === '' || d.description.includes(filterStr)),
    [data, filterStr],
  );

  const sortedByDay = useMemo(() => {
    const result: Record<string, SpendingRecord[]> = {};
    filteredBySearch.forEach((d: SpendingRecord) => {
      const date = formatDate(d.date);
      if (!result[date]) result[date] = [];
      result[date].push(d);
    });
    return result;
  }, [filteredBySearch]);

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-1 text-xs sm:text-sm">
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
      </div>
    );
  } else if (filteredBySearch.length === 0) {
    return (
      <div className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-2 text-xs sm:h-14 sm:text-sm">
        <SearchIcon className="size-5 text-gray-700" />
        <span className="text-gray-700">找不到資料</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 text-xs sm:text-sm">
      {Object.keys(sortedByDay).map((dateStr, index) => (
        <div key={dateStr}>
          <span className="text-gray-500">{dateStr}</span>
          <div
            className="flex flex-col transition-all"
            id={`spending-list-${index.toString()}`}
          >
            {sortedByDay[dateStr].map((spending, index) => (
              <SpendingItem
                key={`${spending.id}-${index.toString()}`}
                spending={spending}
                refreshData={refreshData}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
