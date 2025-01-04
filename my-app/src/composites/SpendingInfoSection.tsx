'use client';

import { DatePicker } from '@/components/DatePicker';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { EditorBlock } from '@/composites/EditorBlock';
import { SpendingList } from '@/composites/SpendingList';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { SpendingType } from '@/utils/constants';
import { ChangeEvent, startTransition, useEffect, useState } from 'react';

export const SpendingInfoSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState<SpendingRecord>();
  const [selectedType, setSelectedType] = useState<SpendingType>(
    SpendingType.Outcome,
  );
  const { syncData, loading } = useGetSpendingCtx();

  const handleOnChangeDate = (event: ChangeEvent) => {
    const date = new Date((event.target as HTMLInputElement).value);
    startTransition(() => {
      setSelectedDate(date);
    });
  };

  const reset = () => {
    setSelectedData(undefined);
  };

  useEffect(() => {
    if (selectedData?.id) {
      setSelectedDate(new Date(selectedData.date));
    }
  }, [selectedData?.id, selectedData?.date]);

  return (
    <div className="relative flex w-full flex-1 flex-col items-center gap-4 p-6">
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={() => syncData()}
          disabled={loading}
          className="rounded-md bg-gray-300 p-2 transition-colors active:bg-gray-400 sm:hover:bg-gray-400"
        >
          <RefreshIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <Switch type={selectedType} onChange={setSelectedType} />
      <DatePicker date={selectedDate} onChange={handleOnChangeDate} />
      <EditorBlock
        type={selectedType}
        date={selectedDate}
        data={selectedData}
        reset={reset}
      />
      <SpendingList
        type={selectedType}
        date={selectedDate}
        handleEdit={setSelectedData}
      />
    </div>
  );
};

const Switch = ({
  type,
  onChange,
}: {
  type: SpendingType;
  onChange: (type: SpendingType) => void;
}) => {
  const handleOnClick = (type: SpendingType) => {
    startTransition(() => {
      onChange(type);
    });
  };
  return (
    <div className="flex items-center gap-1 text-sm sm:text-base">
      <button
        className={`rounded-l border border-solid border-red-500 px-6 py-2 text-center transition-colors ${type === SpendingType.Outcome ? 'bg-red-300' : 'text-red-500 hover:bg-red-300'}`}
        onClick={() => handleOnClick(SpendingType.Outcome)}
      >
        支出
      </button>
      <button
        className={`rounded-r border border-solid border-green-500 px-6 py-2 text-center transition-colors ${type === SpendingType.Income ? 'bg-green-300' : 'text-green-500 hover:bg-green-300'}`}
        onClick={() => handleOnClick(SpendingType.Income)}
      >
        收入
      </button>
    </div>
  );
};
