import { SpendingItem } from '@/app/insert/SpendingItem';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { DateFilter, SpendingType } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  dateFilter: DateFilter;
  date: Date;
  type: SpendingType;
  selectedDataId: string;
  handleEdit: (record: SpendingRecord) => void;
  memberEmail?: string;
  refreshData: () => void;
  reset: () => void;
}

export const SpendingList = (props: Props) => {
  const {
    dateFilter,
    date,
    type,
    selectedDataId,
    memberEmail,
    handleEdit,
    refreshData,
    reset,
  } = props;
  const { loading, data } = useGetSpendingCtx();
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);
  const isInitialized = useRef(false);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const checkDate = useCallback(
    (dateStr: string) => {
      const date = new Date(dateStr);
      if (dateFilter === DateFilter.Month) {
        return date.getFullYear() === year && date.getMonth() === month;
      }
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    },
    [dateFilter, day, month, year],
  );

  const totalAmount = filteredData.reduce(
    (acc, spending) => acc + spending.amount,
    0,
  );

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
    <div className="flex w-full max-w-175 flex-1 flex-col gap-2 text-xs sm:text-sm lg:text-base">
      {!isInitialized.current && (
        <div className="mb-2 flex w-full items-center justify-center pb-80">
          <span>Loading...</span>
        </div>
      )}
      {isInitialized.current && (
        <>
          <div className="flex w-full items-end justify-end px-1">
            <span className="text-gray-500">{`總共: $${normalizeNumber(totalAmount)}`}</span>
          </div>
          {totalAmount === 0 ? (
            <span className="w-full text-center">查無資料</span>
          ) : (
            <div className="scrollbar flex h-96 w-full flex-col gap-1 overflow-y-auto overflow-x-hidden px-1 py-2">
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
          )}
        </>
      )}
    </div>
  );
};
