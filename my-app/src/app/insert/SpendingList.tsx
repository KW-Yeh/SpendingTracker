import { SpendingItem } from '@/app/insert/SpendingItem';
import { useEffect, useRef } from 'react';

interface Props {
  data: SpendingRecord[];
  loading: boolean;
  refreshData: () => void;
}

export const SpendingList = (props: Props) => {
  const { refreshData, data, loading } = props;
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
          <div className="h-11 w-full animate-pulse rounded bg-gray-100 sm:h-14"></div>
          <div className="h-11 w-full animate-pulse rounded bg-gray-100 sm:h-14"></div>
        </div>
      )}
      {isInitialized.current && data.length > 0 && (
        <div className="flex w-full flex-col divide-y divide-gray-300 px-1 py-2">
          {data.map((spending, index) => (
            <SpendingItem
              key={`${spending.id}-${index.toString()}`}
              spending={spending}
              refreshData={refreshData}
            />
          ))}
        </div>
      )}
    </div>
  );
};
