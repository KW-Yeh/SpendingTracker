'use client';

import { SendIcon } from '@/components/icons/SendIcon';
import {
  INCOME_TYPE_OPTIONS,
  Necessity,
  OUTCOME_TYPE_OPTIONS,
  SpendingType,
} from '@/utils/constants';
import { FormEvent, useCallback, useState } from 'react';

interface Props {
  type: SpendingType;
  date: Date;
}

export const EditorBlock = (props: Props) => {
  const spendingCategories =
    props.type === SpendingType.Income
      ? INCOME_TYPE_OPTIONS
      : OUTCOME_TYPE_OPTIONS;
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const necessity = formData.get('necessity') as Necessity;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const amount = Math.abs(parseInt(formData.get('amount') as string));
      if (amount === 0) return;
      setLoading(true);
      const newSpending: SpendingRecord = {
        id: Date.now().toString(),
        type: props.type,
        date: props.date.toUTCString(),
        necessity,
        category,
        description,
        amount,
      };
      console.log('Add new spending:', newSpending);
      setTimeout(() => {
        setLoading(false);
        console.log('complete');
      }, 1000);
    },
    [props.type, props.date],
  );

  return (
    <form
      onSubmit={handleOnSubmit}
      className="flex h-10 w-fit items-center divide-x divide-text rounded-lg border border-solid border-text"
    >
      <div className="flex h-full flex-1 items-center text-xs sm:text-sm lg:text-base">
        <select
          name="necessity"
          className="h-full bg-transparent p-2 focus:outline-0"
        >
          <option value={Necessity.Need}>{Necessity.Need}</option>
          <option value={Necessity.NotNeed}>{Necessity.NotNeed}</option>
        </select>
        <select
          name="category"
          className="h-full bg-transparent p-2 focus:outline-0"
        >
          {spendingCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="description"
          className="h-full w-20 bg-transparent p-2 pr-0 focus:outline-0 sm:w-auto sm:flex-1"
          placeholder="吃了漢堡跟薯條"
        />
        <div className="flex h-full items-center gap-1 p-2">
          <span>$</span>
          <input
            type="number"
            name="amount"
            className="w-10 bg-transparent focus:outline-0 sm:w-16"
            defaultValue={0}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex h-full w-8 items-center justify-center rounded-r-lg hover:bg-primary-300 p-2 transition-colors bg-primary-100"
      >
        <SendIcon className="w-full" />
      </button>
    </form>
  );
};
