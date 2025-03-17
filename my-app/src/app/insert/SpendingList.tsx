import { SpendingItem } from '@/app/insert/SpendingItem';
import { useEffect, useState } from 'react';

interface Props {
  data: SpendingRecord[];
  loading: boolean;
  refreshData: () => void;
}

export const SpendingList = (props: Props) => {
  const { refreshData, data, loading } = props;
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    setIsInit(!loading);
  }, [loading]);

  return (
    <div className="flex w-full flex-col text-xs sm:text-sm">
      {!isInit && (
        <div className="flex w-full flex-col gap-2 px-1 py-2">
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100"></div>
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100"></div>
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100"></div>
        </div>
      )}
      {isInit && (
        <div className="flex w-full flex-col">
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
