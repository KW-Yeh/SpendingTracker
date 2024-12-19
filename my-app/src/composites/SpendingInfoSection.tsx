'use client';

import { DatePicker } from '@/components/DatePicker';
import { Modal } from '@/components/Modal';
import { EditorBlock } from '@/composites/EditorBlock';
import { SpendingList } from '@/composites/SpendingList';
import { SpendingType } from '@/utils/constants';
import { ChangeEvent, useRef, useState } from 'react';

export const SpendingInfoSection = () => {
  const modalRef = useRef<ModalRef>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<SpendingType>(
    SpendingType.Outcome,
  );

  const handleOnChangeDate = (event: ChangeEvent) => {
    const date = new Date((event.target as HTMLInputElement).value);
    setSelectedDate(date);
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-4 p-6">
      <Switch type={selectedType} onChange={setSelectedType} />
      <DatePicker date={selectedDate} onChange={handleOnChangeDate} />
      <EditorBlock type={selectedType} date={selectedDate} />
      <SpendingList type={selectedType} date={selectedDate} />
      <Modal ref={modalRef}>Modal</Modal>
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
  return (
    <div className="flex items-center gap-1">
      <button
        className={`rounded-l border border-solid border-red-500 px-6 py-2 text-center transition-colors ${type === SpendingType.Outcome ? 'bg-red-300' : 'text-red-500 hover:bg-red-300'}`}
        onClick={() => onChange(SpendingType.Outcome)}
      >
        支出
      </button>
      <button
        className={`rounded-r border border-solid border-green-500 px-6 py-2 text-center transition-colors ${type === SpendingType.Income ? 'bg-green-300' : 'text-green-500 hover:bg-green-300'}`}
        onClick={() => onChange(SpendingType.Income)}
      >
        收入
      </button>
    </div>
  );
};
