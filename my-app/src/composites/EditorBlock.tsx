'use client';

import { EnterIcon } from '@/components/icons/EnterIcon';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard } from '@/components/NumberKeyboard';
import { Select } from '@/components/Select';
import { putItem } from '@/services/dbHandler';
import {
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { handleFormatUserToken } from '@/utils/handleFormatUserToken';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';

interface Props {
  data: SpendingRecord;
  groupId?: string;
  memberEmail?: string;
  reset: () => void;
  refreshData: () => void;
}

export const EditorBlock = (props: Props) => {
  const { data, groupId, memberEmail, reset, refreshData } = props;
  const { data: session } = useSession();
  const spendingCategories =
    data.type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP;
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(data.amount);
  const [selectedNecessity, setSelectedNecessity] = useState(data.necessity);
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [newDesc, setNewDesc] = useState(data.description);
  const modalRef = useRef<ModalRef>(null);

  const handleEditDesc = (event: ChangeEvent<HTMLInputElement>) => {
    setNewDesc(event.target.value);
  };

  const handleSelectNecessity = (value: string) => {
    setSelectedNecessity(value);
  };

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
  };

  const handleOnSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      let userEmail = session?.user?.email;
      if (memberEmail) userEmail = memberEmail;
      if (!userEmail) return;
      const userToken = handleFormatUserToken(userEmail, groupId);
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);
      const necessity = formData.get('necessity') as Necessity;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const amount = Math.abs(parseInt(formData.get('amount') as string));
      if (amount === 0) return;
      setLoading(true);
      const newSpending: SpendingRecord = {
        ...data,
        id: data.id,
        'user-token': userToken,
        type: data.type,
        date: data.date,
        necessity,
        category,
        description,
        amount,
      };

      await putItem(newSpending);
      refreshData();
      setLoading(false);
      reset();
    },
    [session?.user?.email, memberEmail, groupId, data, reset, refreshData],
  );

  return (
    <>
      <form
        onSubmit={handleOnSubmit}
        className="relative flex h-fit w-full max-w-175 items-center rounded-lg border border-solid border-text"
      >
        <div className="flex h-10 flex-1 items-center text-xs sm:h-12 sm:text-sm lg:text-base">
          <Select
            value={selectedNecessity}
            className="h-full py-2 pl-4"
            name="necessity"
            onChange={handleSelectNecessity}
          >
            <Select.Item value={Necessity.Need}>必要收支</Select.Item>
            <Select.Item value={Necessity.NotNeed}>額外收支</Select.Item>
          </Select>
          <Select
            value={selectedCategory}
            className="h-full py-2 pl-4"
            name="category"
            onChange={handleSelectCategory}
          >
            {spendingCategories.map((category) => (
              <Select.Item
                key={category.value}
                value={category.value}
                className="min-w-24"
              >
                {`${category.value} ${category.label}`}
              </Select.Item>
            ))}
          </Select>
          <div className="h-full flex-1">
            <input
              type="text"
              name="description"
              value={newDesc}
              onChange={handleEditDesc}
              className="h-full w-full bg-transparent py-2 pl-4 pr-0 focus:outline-0"
              placeholder="描述一下"
            />
          </div>
          <button
            type="button"
            onClick={() => modalRef.current?.open()}
            className="flex h-full w-16 items-center gap-1 p-2 sm:w-24"
          >
            <span>$</span>
            <span>{normalizeNumber(amount)}</span>
            <input
              type="text"
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
          className="flex h-full w-12 shrink-0 items-center justify-center rounded-r-lg border-l border-solid border-text bg-primary-100 p-2 transition-colors hover:bg-primary-300 sm:w-12"
        >
          {loading && (
            <Loading className="size-3 animate-spin text-white sm:size-4" />
          )}
          {!loading && <EnterIcon className="size-3 sm:size-4" />}
        </button>
      </form>
      <Modal ref={modalRef} className="w-72 sm:w-80" title="你的花費">
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
