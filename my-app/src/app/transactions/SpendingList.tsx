'use client';

import { SpendingItem } from '@/app/transactions/SpendingItem';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { formatDate } from '@/utils/formatDate';
import { CATEGORY_WORDING_MAP, SpendingType } from '@/utils/constants';
import { useMemo } from 'react';

interface Props {
  data: SpendingRecord[];
  filterStr: string;
  sortBy: string;
  loading: boolean;
  refreshData: () => void;
}

export const SpendingList = (props: Props) => {
  const { refreshData, data, filterStr, sortBy, loading } = props;

  const filteredBySearch = useMemo(
    () =>
      data.filter((d) => filterStr === '' || d.description.includes(filterStr)),
    [data, filterStr],
  );

  const sortedData = useMemo(() => {
    const result: Record<string, SpendingRecord[]> = {};

    filteredBySearch.forEach((d: SpendingRecord) => {
      let key: string;

      if (sortBy === 'category') {
        key = CATEGORY_WORDING_MAP[d.category] || d.category;
      } else if (sortBy === 'type') {
        key = d.type === SpendingType.Income ? '收入' : '支出';
      } else {
        // 預設按日期排序
        key = formatDate(d.date);
      }

      if (!result[key]) result[key] = [];
      result[key].push(d);
    });

    return result;
  }, [filteredBySearch, sortBy]);

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-2 text-xs sm:text-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="mb-1 h-4 w-24 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
            <div className="mt-1 h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"></div>
          </div>
        ))}
      </div>
    );
  } else if (filteredBySearch.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <SearchIcon className="mb-3 size-10 text-gray-300" />
        <p className="mb-1 font-medium text-gray-600">找不到符合的帳目</p>
        <p className="text-sm text-gray-300">請嘗試其他搜尋條件或新增帳目</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 text-xs sm:text-sm">
      {Object.keys(sortedData).map((groupKey, index) => (
        <div key={groupKey}>
          <span className="text-gray-300">{groupKey}</span>
          <div
            className="flex flex-col gap-1 rounded border-2 border-solid border-transparent p-1 transition-all"
            id={`spending-list-${groupKey}`}
          >
            {sortedData[groupKey].map((spending, index) => (
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
