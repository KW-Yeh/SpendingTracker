'use client';

import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { useState } from 'react';

export const YearlyBudgetTemplate = () => {
  const [allocation, setAllocation] = useState<Allocation[]>([]);

  const handleAddAllocation = () => {
    setAllocation((prevState) => {
      const newState = [...prevState];
      const newAllocation: Allocation = {
        id: newState.length + 1,
        name: '',
        budget: 0,
        percentage: 0,
      };
      newState.push(newAllocation);
      return newState;
    });
  };

  const handleRemoveAllocation = (id: number) => {
    setAllocation((prevState) => {
      const newState = [...prevState];
      const index = newState.findIndex((item) => item.id === id);
      if (index !== -1) {
        newState.splice(index, 1);
      }
      return newState;
    });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-lg font-semibold">年度支出分配</h2>
        <button
          type="button"
          onClick={handleAddAllocation}
          className="bg-primary-500 hover:bg-primary-600 text-background flex items-center gap-1 rounded-lg px-3 py-2 transition-colors"
        >
          <PlusIcon />
          <span>新增類別</span>
        </button>
      </div>
      <form className="flex w-full flex-col gap-4 pt-6">
        {allocation.map((item) => (
          <AllocationItem
            key={item.id}
            data={item}
            handleRemove={handleRemoveAllocation}
          />
        ))}
      </form>
    </div>
  );
};

const AllocationItem = ({
  data,
  handleRemove,
}: {
  data: Allocation;
  handleRemove: (id: number) => void;
}) => {
  return (
    <div className="bg-primary-100 flex w-full items-center justify-between gap-2 rounded-lg p-4">
      <fieldset>
        <legend className="text-sm">類別名稱</legend>
        <input
          type="text"
          name={`allocation-name-${data.id}`}
          className="bg-background focus:border-primary-500 max-w-40 rounded-lg border border-solid border-gray-300 px-1 py-2 transition-colors focus:outline-0"
          defaultValue={data.name}
          placeholder="例如：飲食"
        />
      </fieldset>
      <fieldset>
        <legend className="text-sm">金額(NT$)</legend>
        <input
          type="number"
          name={`allocation-budget-${data.id}`}
          className="bg-background focus:border-primary-500 max-w-40 rounded-lg border border-solid border-gray-300 px-1 py-2 transition-colors focus:outline-0"
          defaultValue={data.budget}
          placeholder="金額"
        />
      </fieldset>
      <fieldset>
        <legend className="text-sm">百分比</legend>
        <div className="flex items-center gap-1">
          <input
            type="number"
            name={`allocation-percentage-${data.id}`}
            className="bg-background focus:border-primary-500 max-w-40 rounded-lg border border-solid border-gray-300 px-1 py-2 transition-colors focus:outline-0"
            defaultValue={data.percentage}
            placeholder="%"
          />
          <span>%</span>
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => handleRemove(data.id)}
        className="hover:text-background shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};
