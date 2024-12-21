'use client';

import { DatePicker } from '@/components/DatePicker';
import { EditorBlock } from '@/composites/EditorBlock';
import { SpendingList } from '@/composites/SpendingList';
import { Necessity, SpendingType } from '@/utils/constants';
import { ChangeEvent, startTransition, useState } from 'react';

const TEST_DATA: SpendingRecord[] = [
  {
    id: '1',
    type: SpendingType.Outcome,
    necessity: Necessity.Need,
    category: '🍔',
    description: '買了一些吃的',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '2',
    type: SpendingType.Outcome,
    necessity: Necessity.Need,
    category: '👗',
    description: '買了一些衣服',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '3',
    type: SpendingType.Income,
    necessity: Necessity.Need,
    category: '📈',
    description: '賣股票',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '4',
    type: SpendingType.Income,
    necessity: Necessity.Need,
    category: '🎁',
    description: '路上撿到錢',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '5',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '🎲',
    description: '買遊戲',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '6',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '📚',
    description: '買書',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '7',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '💊',
    description: '看醫生',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '8',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '📉',
    description: '買股票',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '9',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '✨',
    description: '其他花費',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '10',
    type: SpendingType.Outcome,
    necessity: Necessity.Need,
    category: '🏠',
    description: '房租',
    amount: 100,
    date: new Date().toUTCString(),
  },
];

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
        list={TEST_DATA}
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
