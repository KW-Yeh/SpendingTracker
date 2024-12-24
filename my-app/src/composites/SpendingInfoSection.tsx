'use client';

import { DatePicker } from '@/components/DatePicker';
import { EditorBlock } from '@/composites/EditorBlock';
import { SpendingList } from '@/composites/SpendingList';
import { SpendingType } from '@/utils/constants';
import { ChangeEvent, startTransition, useState } from 'react';

export const SpendingInfoSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState<SpendingRecord>();
  const [selectedType, setSelectedType] = useState<SpendingType>(
    SpendingType.Outcome,
  );

  const handleOnChangeDate = (event: ChangeEvent) => {
    const date = new Date((event.target as HTMLInputElement).value);
    startTransition(() => {
      setSelectedDate(date);
    });
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-4 p-6">
      <Switch type={selectedType} onChange={setSelectedType} />
      <DatePicker date={selectedDate} onChange={handleOnChangeDate} />
      <EditorBlock
        type={selectedType}
        date={selectedDate}
        data={selectedData}
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
