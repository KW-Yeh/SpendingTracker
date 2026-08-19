'use client';

import { SpendingItem } from '@/app/transactions/SpendingItem';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { formatDate } from '@/utils/formatDate';
import { CATEGORY_WORDING_MAP, SpendingType } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useMemo } from 'react';

interface Props {
  data: SpendingRecord[];
  filterStr: string;
  sortBy: string;
  loading: boolean;
  refreshData: () => void;
}

/** 分組淨額：收入為正、支出為負，讓每天／每類一眼看得到小計。 */
const getGroupNet = (records: SpendingRecord[]) =>
  records.reduce(
    (sum, record) =>
      record.type === SpendingType.Income
        ? sum + Number(record.amount)
        : sum - Number(record.amount),
    0,
  );

export const SpendingList = (props: Props) => {
  const { refreshData, data, filterStr, sortBy, loading } = props;

  const filteredBySearch = useMemo(
    () =>
      data.filter((d) => filterStr === '' || d.description.includes(filterStr)),
    [data, filterStr],
  );

  const sortedData = useMemo(() => {
    const result: Record<string, SpendingRecord[]> = {};
    const dataToGroup =
      sortBy === 'date'
        ? [...filteredBySearch].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
        : filteredBySearch;

    dataToGroup.forEach((d: SpendingRecord) => {
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
      <div className="flex w-full flex-col gap-4 text-xs sm:text-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="skeleton mb-1 h-4 w-32 rounded-md"></div>
            <div className="skeleton h-30 w-full rounded-[18px]"></div>
          </div>
        ))}
      </div>
    );
  } else if (filteredBySearch.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <SearchIcon className="mb-3 size-10 text-gray-500" />
        <p className="mb-1 font-semibold text-gray-300">找不到符合的帳目</p>
        <p className="text-sm text-gray-500">請嘗試其他搜尋條件或新增帳目</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 text-xs sm:text-sm">
      {Object.keys(sortedData).map((groupKey) => {
        const net = getGroupNet(sortedData[groupKey]);
        return (
          <div key={groupKey} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 px-1">
              <span className="text-xs font-semibold tracking-wide text-gray-400">
                {groupKey}
              </span>
              <span
                className="text-[13px] font-semibold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontVariantNumeric: 'tabular-nums',
                  color:
                    net < 0 ? 'var(--color-expense)' : 'var(--color-income)',
                }}
              >
                {net < 0 ? '−' : '+'}${normalizeNumber(Math.abs(net))}
              </span>
            </div>
            <div
              className="flex flex-col rounded-[18px] border border-black/[0.08] bg-gray-950 px-3"
              id={`spending-list-${groupKey}`}
            >
              {sortedData[groupKey].map((spending, index) => (
                <SpendingItem
                  key={`${spending.id}-${index.toString()}`}
                  spending={spending}
                  refreshData={refreshData}
                  showDate={sortBy !== 'date'}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
