import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { Necessity, SpendingType } from '@/utils/constants';
import { useMemo } from 'react';

interface Props {
  date: Date;
  type: SpendingType;
}

const TEST_DATA: SpendingRecord[] = [
  {
    id: '1',
    type: SpendingType.Outcome,
    necessity: Necessity.Need,
    category: '🍔',
    description: 'Bought some groceries',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '2',
    type: SpendingType.Outcome,
    necessity: Necessity.Need,
    category: '👗',
    description: 'Bought some clothes',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '3',
    type: SpendingType.Income,
    necessity: Necessity.Need,
    category: '📈',
    description: 'Received salary',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '4',
    type: SpendingType.Income,
    necessity: Necessity.Need,
    category: '🎁',
    description: 'Received bonus',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '5',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '🎲',
    description: 'Bought some games',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '6',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '📚',
    description: 'Bought some books',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '7',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '💊',
    description: 'Bought some medicine',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '8',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '📉',
    description: 'Invested in stock',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '9',
    type: SpendingType.Outcome,
    necessity: Necessity.NotNeed,
    category: '✨',
    description: 'Other expenses',
    amount: 100,
    date: new Date().toUTCString(),
  },
  {
    id: '10',
    type: SpendingType.Outcome,
    necessity: Necessity.Need,
    category: '🏠',
    description: 'Paid reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeent',
    amount: 100,
    date: new Date().toUTCString(),
  },
];

export const SpendingList = (props: Props) => {
  const year = props.date.getFullYear();
  const month = props.date.getMonth();
  const day = props.date.getDate();

  const filteredData = useMemo(
    () =>
      [...TEST_DATA, ...TEST_DATA]
        .filter((data) => data.type === props.type)
        .sort((_, b) => {
          if (b.necessity === Necessity.Need) return 1;
          return -1;
        }),
    [props.type],
  );

  const totalAmount = filteredData.reduce(
    (acc, spending) => acc + spending.amount,
    0,
  );

  return (
    <div className="flex w-full max-w-[700px] flex-1 flex-col justify-end gap-2 text-xs sm:text-sm lg:text-base">
      <h3 className="">{`${year}/${month}/${day}: $${totalAmount}`}</h3>
      <div className="scrollbar flex h-96 w-full flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {filteredData.map((spending, index) => (
          <div
            key={`${spending.id}-${index.toString()}`}
            className={`grid grid-cols-12 items-center gap-2 rounded p-2 ${spending.necessity === Necessity.Need ? 'bg-gray-200' : ''}`}
          >
            <div className="col-span-1">{spending.necessity}</div>
            <div className="col-span-1 flex items-center justify-center">
              <div className="rounded border border-solid border-text p-1">
                {spending.category}
              </div>
            </div>
            <div className="col-span-5 overflow-hidden text-ellipsis whitespace-nowrap">
              {spending.description}
            </div>
            <div className="col-span-2 text-end">${spending.amount}</div>
            <div className="col-span-3 flex items-center justify-end gap-px">
              <button className="group rounded p-2 transition-colors hover:bg-primary-300">
                <EditIcon className="size-4 transition-colors group-hover:text-background" />
              </button>
              <button className="group rounded p-2 transition-colors hover:bg-red-300">
                <DeleteIcon className="size-4 transition-colors group-hover:text-background" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
