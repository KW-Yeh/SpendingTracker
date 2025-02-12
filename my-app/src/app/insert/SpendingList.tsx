import { SpendingItem } from '@/app/insert/SpendingItem';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useEffect, useRef } from 'react';

interface Props {
  data: SpendingRecord[];
  selectedDataId: string;
  handleEdit: (record: SpendingRecord) => void;
  refreshData: () => void;
  reset: () => void;
}

export const SpendingList = (props: Props) => {
  const { selectedDataId, handleEdit, refreshData, reset, data } = props;
  const { loading } = useGetSpendingCtx();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!loading && !isInitialized.current) {
      isInitialized.current = true;
    }
  }, [loading]);

  return (
    <div className="flex w-full flex-col gap-2 text-xs sm:text-sm">
      {!isInitialized.current && (
        <div className="flex w-full flex-col gap-2 px-1 py-2">
          <div className="h-11 w-full animate-pulse rounded bg-gray-200 sm:h-14"></div>
          <div className="h-11 w-full animate-pulse rounded bg-gray-200 sm:h-14"></div>
        </div>
      )}
      {isInitialized.current && data.length > 0 && (
        <div className="flex w-full flex-col gap-2 px-1 py-2">
          {data.map((spending, index) => (
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
    </div>
  );
};
