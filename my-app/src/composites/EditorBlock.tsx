'use client';

import { EnterIcon } from '@/components/icons/EnterIcon';
import { Modal } from '@/components/Modal';
import { NumberKeyboard } from '@/components/NumberKeyboard';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { putItem } from '@/services/dbHandler';
import {
  INCOME_TYPE_OPTIONS,
  Necessity,
  OUTCOME_TYPE_OPTIONS,
  SpendingType,
} from '@/utils/constants';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';

interface Props {
  type: SpendingType;
  date: Date;
  data?: SpendingRecord;
}

export const EditorBlock = (props: Props) => {
  const { syncData } = useGetSpendingCtx();
  const spendingCategories =
    props.type === SpendingType.Income
      ? INCOME_TYPE_OPTIONS
      : OUTCOME_TYPE_OPTIONS;
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(props.data?.amount ?? 0);
  const [selectedNecessity, setSelectedNecessity] = useState(
    props.data?.necessity,
  );
  const [selectedCategory, setSelectedCategory] = useState(
    props.data?.category,
  );
  const [newDesc, setNewDesc] = useState(props.data?.description ?? '');
  const modalRef = useRef<ModalRef>(null);

  useEffect(() => {
    setAmount(props.data?.amount ?? 0);
    setNewDesc(props.data?.description ?? '');
    setSelectedNecessity(props.data?.necessity);
    setSelectedCategory(props.data?.category);
  }, [props.data]);

  const handleEditDesc = (event: ChangeEvent<HTMLInputElement>) => {
    setNewDesc(event.target.value);
  };

  const handleSelectNecessity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedNecessity(event.target.value);
  };

  const handleSelectCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleOnSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);
      const necessity = formData.get('necessity') as Necessity;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const amount = Math.abs(parseInt(formData.get('amount') as string));
      if (amount === 0) return;
      setLoading(true);
      const newSpending: SpendingRecord = {
        ...(props.data ?? {}),
        id: props.data?.id ?? uuid(),
        'user-token': 'test',
        type: props.type,
        date: props.date.toUTCString(),
        necessity,
        category,
        description,
        amount,
      };

      putItem(newSpending)
        .then(() => {
          syncData();
        })
        .then(() => {
          setLoading(false);
          setNewDesc('');
          setSelectedNecessity(undefined);
          setSelectedCategory(undefined);
          setAmount(0);
        });
    },
    [props.type, props.date, props.data],
  );

  return (
    <>
      <form
        onSubmit={handleOnSubmit}
        className="max-w-175 flex h-fit w-full items-center divide-x divide-text rounded-lg border border-solid border-text"
      >
        <div className="flex h-full flex-1 items-center text-xs sm:text-sm lg:text-base">
          <select
            value={selectedNecessity}
            onChange={handleSelectNecessity}
            name="necessity"
            className="h-full bg-transparent p-2 focus:outline-0 sm:py-4"
          >
            <option value={Necessity.Need}>{Necessity.Need}</option>
            <option value={Necessity.NotNeed}>{Necessity.NotNeed}</option>
          </select>
          <select
            value={selectedCategory}
            onChange={handleSelectCategory}
            name="category"
            className="h-full bg-transparent p-2 focus:outline-0 sm:py-4"
          >
            {spendingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="flex-1">
            <input
              type="text"
              name="description"
              value={newDesc}
              onChange={handleEditDesc}
              className="h-full w-full bg-transparent p-2 pr-0 focus:outline-0 sm:py-4"
              placeholder="描述一下"
            />
          </div>
          <button
            type="button"
            onClick={() => modalRef.current?.open()}
            className="flex h-full w-20 items-center gap-2 p-2 sm:w-24 sm:py-4"
          >
            <span>$</span>
            <span>{amount}</span>
            <input
              type="number"
              name="amount"
              value={amount}
              className="hidden"
              readOnly
            />
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-full w-8 shrink-0 items-center justify-center rounded-r-lg bg-primary-100 p-2 transition-colors hover:bg-primary-300 sm:w-12"
        >
          <EnterIcon className="size-3 sm:size-4" />
        </button>
      </form>
      <Modal ref={modalRef} className="w-72 sm:w-80">
        <h1 className="text-base font-bold sm:text-xl">Number Keyboard</h1>
        <NumberKeyboard
          default={amount}
          onConfirm={(val) => {
            setAmount(val);
            modalRef.current?.close();
          }}
        />
      </Modal>
    </>
  );
};
