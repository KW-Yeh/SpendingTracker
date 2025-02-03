'use client';

import { CalculatorIcon } from '@/components/icons/CalculatorIcon';
import { Loading } from '@/components/icons/Loading';
import { SendIcon } from '@/components/icons/SendIcon';
import { Modal } from '@/components/Modal';
import { NumberKeyboard } from '@/components/NumberKeyboard';
import { Select } from '@/components/Select';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { putItem } from '@/services/dbHandler';
import {
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useSession } from 'next-auth/react';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v7 as uuid } from 'uuid';

interface Props {
  data: SpendingRecord;
  groupId?: string;
  memberEmail?: string;
  reset: () => void;
}

export const EditorBlock = (props: Props) => {
  const { data, groupId, memberEmail, reset } = props;
  const { data: session } = useSession();
  const { syncData } = useGetSpendingCtx();
  const spendingCategories =
    data.type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP;
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(data.amount);
  const [selectedNecessity, setSelectedNecessity] = useState(data.necessity);
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [newDesc, setNewDesc] = useState(data.description);
  const modalRef = useRef<ModalRef>(null);
  const [isNoAmount, setIsNoAmount] = useState(false);

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
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);
      const necessity = formData.get('necessity') as Necessity;
      const category = formData.get('category') as string;
      const description = formData.get('description') as string;
      const amount = Math.abs(parseInt(formData.get('amount') as string));
      if (amount === 0) {
        setIsNoAmount(true);
        return;
      }
      setLoading(true);
      const newSpending: SpendingRecord = {
        ...data,
        id: data.id || uuid(),
        'user-token': userEmail,
        groupId: groupId || undefined,
        type: data.type,
        date: data.date,
        necessity,
        category,
        description,
        amount,
      };

      await putItem(newSpending);
      syncData(groupId, userEmail);
      setLoading(false);
      reset();
    },
    [session?.user?.email, memberEmail, groupId, data, reset, syncData],
  );

  useEffect(() => {
    if (amount !== 0) {
      setIsNoAmount(false);
    }
  }, [amount]);

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
            className={`mr-1 flex h-full w-20 items-center justify-between gap-1 p-2 sm:w-24 ${isNoAmount ? 'text-red-500' : ''}`}
          >
            <span className="flex items-center gap-1">
              <span>$</span>
              <span>{normalizeNumber(amount)}</span>
            </span>
            <CalculatorIcon className="size-4" />
            <input
              type="text"
              name="amount"
              value={amount}
              className="hidden"
              readOnly
            />
          </button>
        </div>
        <div className="flex h-full items-center justify-center border-l border-solid border-text">
          <button
            type="submit"
            disabled={loading}
            className="group flex h-full shrink-0 items-center justify-center rounded-r-lg bg-primary-100 p-3 transition-colors active:bg-primary-300 disabled:bg-gray-300 sm:hover:bg-primary-300"
          >
            {loading && (
              <Loading className="size-4 animate-spin text-white" />
            )}
            {!loading && (
              <SendIcon className="size-4 -translate-x-px rotate-45" />
            )}
          </button>
        </div>
      </form>
      <Modal ref={modalRef} className="sm:max-w-96" title="你的花費">
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
