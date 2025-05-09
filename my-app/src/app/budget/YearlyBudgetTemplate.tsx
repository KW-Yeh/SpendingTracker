'use client';

import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

export const YearlyBudgetTemplate = () => {
  const { config: userData, setter: updateUser, syncUser } = useUserConfigCtx();
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [allocation, setAllocation] = useState<Allocation[]>(
    userData?.allocation ?? [],
  );

  const handleOnChangeTotalBudget = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setTotalBudget(value);
  };

  const handleSaveChanges = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!userData) return;
      const formData = new FormData(event.target as HTMLFormElement);
      const newAllocation: Allocation[] = allocation
        .map((item) => {
          const name = formData.get(`allocation-name-${item.id}`) as string;
          const budget =
            Number(formData.get(`allocation-budget-${item.id}`)) ?? 0;
          const percentage = Number(
            formData.get(`allocation-percentage-${item.id}`) ?? 0,
          );
          return {
            id: item.id,
            name: name,
            budget: budget,
            percentage: percentage,
          };
        })
        .filter(
          (item) => item.name !== '' && item.budget > 0 && item.percentage > 0,
        );
      updateUser({
        ...userData,
        allocation: newAllocation,
      });
      syncUser();
    },
    [allocation, syncUser, updateUser, userData],
  );

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
    <div className="flex w-full flex-col pt-10">
      <div className="flex w-full items-center justify-between gap-6">
        <div className="flex flex-1 items-center text-lg font-semibold">
          <span className="whitespace-nowrap">總預算：</span>
          <input
            type="number"
            className="bg-background focus:border-primary-500 w-full max-w-50 rounded-lg border-2 border-solid border-gray-300 px-2 py-1 transition-colors focus:outline-0 sm:max-w-70"
            value={totalBudget}
            onChange={handleOnChangeTotalBudget}
          />
        </div>
        <button
          type="button"
          onClick={handleAddAllocation}
          className="bg-primary-500 hover:bg-primary-600 text-background flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <PlusIcon />
          <span className="whitespace-nowrap">新增項目</span>
        </button>
      </div>
      <form
        onSubmit={handleSaveChanges}
        className="flex w-full flex-col gap-4 pt-6"
      >
        {allocation.map((item) => (
          <AllocationItem
            key={item.id}
            data={item}
            totalBudget={totalBudget}
            handleRemove={handleRemoveAllocation}
          />
        ))}
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-background w-30 self-center rounded-lg px-4 py-2 text-center transition-colors"
        >
          儲存變更
        </button>
      </form>
    </div>
  );
};

const AllocationItem = ({
  data,
  totalBudget,
  handleRemove,
}: {
  data: Allocation;
  totalBudget: number;
  handleRemove: (id: number) => void;
}) => {
  const [budget, setBudget] = useState(data.budget);
  const [percentage, setPercentage] = useState(data.percentage);

  const handleOnChangeBudget = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setBudget(value);
      if (totalBudget > 0) {
        setPercentage(Math.floor(value / totalBudget) * 100);
      }
    },
    [totalBudget],
  );

  const handleOnChangePercentage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setPercentage(value);
      if (totalBudget > 0) {
        setBudget(Math.floor((value / 100) * totalBudget));
      }
    },
    [totalBudget],
  );

  return (
    <div className="bg-primary-100 relative flex w-full items-center gap-4 rounded-lg p-4 pl-10">
      <div className="bg-background absolute top-1 left-1 flex size-6 items-center justify-center rounded-full">
        <span className="text-sm">{data.id}</span>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
        <fieldset className="min-w-40 max-sm:w-full sm:flex-1">
          <legend className="text-sm">類別名稱</legend>
          <input
            type="text"
            name={`allocation-name-${data.id}`}
            className="bg-background focus:border-primary-500 w-full rounded-lg border border-solid border-gray-300 px-1 py-2 transition-colors focus:outline-0"
            defaultValue={data.name}
            placeholder="例如：飲食"
          />
        </fieldset>
        <div className="flex items-center gap-2">
          <fieldset className="w-25">
            <legend className="text-sm">金額(NT$)</legend>
            <input
              type="number"
              name={`allocation-budget-${data.id}`}
              className="bg-background focus:border-primary-500 w-full rounded-lg border border-solid border-gray-300 px-1 py-2 transition-colors focus:outline-0"
              defaultValue={budget}
              onChange={handleOnChangeBudget}
              placeholder="金額"
            />
          </fieldset>
          <fieldset className="w-25">
            <legend className="text-sm">百分比</legend>
            <div className="flex items-center gap-1">
              <input
                type="number"
                name={`allocation-percentage-${data.id}`}
                className="bg-background focus:border-primary-500 w-full rounded-lg border border-solid border-gray-300 px-1 py-2 transition-colors focus:outline-0"
                defaultValue={percentage}
                onChange={handleOnChangePercentage}
                placeholder="%"
              />
              <span>%</span>
            </div>
          </fieldset>
        </div>
      </div>

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
