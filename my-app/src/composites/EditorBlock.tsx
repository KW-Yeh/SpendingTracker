'use client';

import { EnterIcon } from '@/components/icons/EnterIcon';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard } from '@/components/NumberKeyboard';
import { Select } from '@/components/Select';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useRoleCtx } from '@/context/UserRoleProvider';
import { putItem } from '@/services/dbHandler';
import {
  INCOME_TYPE_OPTIONS,
  Necessity,
  OUTCOME_TYPE_OPTIONS,
  SpendingType,
  USER_TOKEN_SEPARATOR,
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
import { v4 as uuid } from 'uuid';

interface Props {
  type: SpendingType;
  date: Date;
  data?: SpendingRecord;
}

export const EditorBlock = (props: Props) => {
  const { syncData } = useGetSpendingCtx();
  const { group: selectedGroup } = useRoleCtx();
  const { data: session } = useSession();
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

  const handleSelectNecessity = (value: string) => {
    setSelectedNecessity(value);
  };

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
  };

  const handleOnSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const userEmail = session?.user?.email;
      if (!userEmail) return;
      let userToken = userEmail;
      if (selectedGroup) {
        userToken += USER_TOKEN_SEPARATOR + selectedGroup.id;
      }
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
        'user-token': userToken,
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
    [
      session?.user?.email,
      selectedGroup,
      props.data,
      props.type,
      props.date,
      syncData,
    ],
  );

  return (
    <>
      <form
        onSubmit={handleOnSubmit}
        className="flex h-fit w-full max-w-175 items-center divide-x divide-text rounded-lg border border-solid border-text"
      >
        <div className="flex h-10 flex-1 items-center text-xs sm:text-sm lg:text-base">
          <Select
            value={selectedNecessity ?? Necessity.Need}
            className="h-full py-2 pl-4"
            name="necessity"
            onChange={handleSelectNecessity}
          >
            <Select.Item value={Necessity.Need}>{Necessity.Need}</Select.Item>
            <Select.Item value={Necessity.NotNeed}>
              {Necessity.NotNeed}
            </Select.Item>
          </Select>
          <Select
            value={selectedCategory ?? spendingCategories[0]}
            className="h-full py-2 pl-4"
            name="category"
            onChange={handleSelectCategory}
          >
            {spendingCategories.map((category) => (
              <Select.Item key={category} value={category}>
                {category}
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
          className="flex h-full w-12 shrink-0 items-center justify-center rounded-r-lg bg-primary-100 p-2 transition-colors hover:bg-primary-300 sm:w-12"
        >
          {loading && (
            <Loading className="size-3 animate-spin text-white sm:size-4" />
          )}
          {!loading && <EnterIcon className="size-3 sm:size-4" />}
        </button>
      </form>
      <Modal ref={modalRef} className="w-72 sm:w-80">
        <h1 className="text-base font-bold sm:text-xl">你的花費</h1>
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
