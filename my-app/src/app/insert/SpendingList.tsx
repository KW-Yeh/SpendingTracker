import { SpendingItem } from '@/app/insert/SpendingItem';
import { Select } from '@/components/Select';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { SpendingType } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  date: Date;
  type: SpendingType;
  selectedDataId: string;
  handleEdit: (record: SpendingRecord) => void;
  memberEmail?: string;
  refreshData: () => void;
  reset: () => void;
}

enum FilterType {
  Today,
  ThisMonth,
}

export const SpendingList = (props: Props) => {
  const {
    date,
    type,
    selectedDataId,
    memberEmail,
    handleEdit,
    refreshData,
    reset,
  } = props;
  const { loading, data } = useGetSpendingCtx();
  const [filter, setFilter] = useState(FilterType.Today);
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);
  const isInitialized = useRef(false);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const checkDate = useCallback(
    (dateStr: string) => {
      const date = new Date(dateStr);
      if (filter === FilterType.ThisMonth) {
        return date.getFullYear() === year && date.getMonth() === month;
      }
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    },
    [day, month, year, filter],
  );

  const totalAmount = filteredData.reduce(
    (acc, spending) => acc + spending.amount,
    0,
  );

  const today = useMemo(() => `當天 ${month + 1}/${day}`, [day, month]);
  const thisMonth = useMemo(() => `當月 ${month + 1}月`, [month]);

  useEffect(() => {
    if (!loading && !isInitialized.current) {
      isInitialized.current = true;
    }
    setFilteredData(
      [...data].filter(
        (data) =>
          (memberEmail === '' || data['user-token'] === memberEmail) &&
          data.type === type &&
          checkDate(data.date),
      ),
    );
  }, [loading, memberEmail, checkDate, data, type]);

  return (
    <div className="flex w-full max-w-175 flex-1 flex-col justify-end gap-2 text-xs sm:text-sm lg:text-base">
      {!isInitialized.current && (
        <div className="mb-2 flex w-full items-center justify-center pb-80">
          <span>Loading...</span>
        </div>
      )}
      {isInitialized.current && (
        <>
          <div className="flex w-full items-end justify-between px-1">
            <Select
              name="filter"
              className="rounded-full border border-solid px-3 py-1 transition-colors active:border-text sm:hover:border-text"
              value={filter === FilterType.Today ? today : thisMonth}
              onChange={(value) => setFilter(Number(value))}
            >
              <Select.Item value={FilterType.Today.toString()}>
                {today}
              </Select.Item>
              <Select.Item value={FilterType.ThisMonth.toString()}>
                {thisMonth}
              </Select.Item>
            </Select>
            <span className="text-gray-500">{`總共: $${normalizeNumber(totalAmount)}`}</span>
          </div>
          <div className="scrollbar flex h-80 w-full flex-col gap-1 overflow-y-auto overflow-x-hidden px-1 py-2">
            {filteredData.map((spending, index) => (
              <SpendingItem
                key={`${spending.id}-${index.toString()}`}
                spending={spending}
                id={selectedDataId}
                handleEdit={handleEdit}
                refreshData={refreshData}
                reset={reset}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
