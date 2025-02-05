'use client';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard, NumberKeyboardRef } from '@/components/NumberKeyboard';
import { Switch } from '@/components/Switch';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { putItem } from '@/services/dbHandler';
import {
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { useSession } from 'next-auth/react';
import {
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v7 as uuid } from 'uuid';

interface Props {
  data: SpendingRecord;
  isNewData: boolean;
  ref: RefObject<ModalRef | null>;
  reset: () => void;
}

export const EditExpenseModal = (props: Props) => {
  const { data, isNewData, ref, reset } = props;
  const { data: session } = useSession();
  const { syncData } = useGetSpendingCtx();
  const numberKeyboardRef = useRef<NumberKeyboardRef>(null);
  const [spendingType, setSpendingType] = useState<string>(data.type);
  const [necessity, setNecessity] = useState<string>(data.necessity);
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [amount, setAmount] = useState(data.amount);
  const [isNoAmount, setIsNoAmount] = useState(false);
  const [memberEmail, setMemberEmail] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const spendingCategories = useMemo(
    () =>
      data.type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP,
    [data.type],
  );

  const handleOnSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const userEmail = session?.user?.email;
      if (!userEmail) return;
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);
      const description = formData.get('description') as string;
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
        type: spendingType,
        date: data.date,
        necessity,
        category: selectedCategory,
        description,
        amount,
      };

      await putItem(newSpending);
      syncData(groupId, userEmail);
      setLoading(false);
      reset();
    },
    [
      session?.user?.email,
      amount,
      data,
      groupId,
      spendingType,
      necessity,
      selectedCategory,
      syncData,
      reset,
    ],
  );

  useEffect(() => {
    if (amount !== 0) {
      setIsNoAmount(false);
    }
  }, [amount]);

  return (
    <Modal
      ref={ref}
      className="w-full max-sm:mt-auto max-sm:rounded-b-none sm:max-w-96"
      title={isNewData ? '新增記錄' : '修改記錄'}
    >
      <form className="flex flex-col gap-2" onSubmit={handleOnSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Switch
              option1={{
                label: '支出',
                value: SpendingType.Outcome,
                onSelectColor: '#fca5a5',
                className: '!px-2',
              }}
              option2={{
                label: '收入',
                value: SpendingType.Income,
                onSelectColor: '#86efac',
                className: '!px-2',
              }}
              value={spendingType}
              className="text-sm"
              onChange={setSpendingType}
            />
            <Switch
              option1={{
                label: '必要開銷',
                value: Necessity.Need,
                onSelectColor: '#fdba74',
                className: '!px-2',
              }}
              option2={{
                label: '額外開銷',
                value: Necessity.NotNeed,
                onSelectColor: '#d1d5db',
                className: '!px-2',
              }}
              value={necessity}
              className="text-sm"
              onChange={setNecessity}
            />
          </div>
          <fieldset className="rounded-lg p-1">
            <legend className="font-bold">類型</legend>
            <div className="flex w-full flex-wrap items-start gap-2">
              {spendingCategories.map((category) => (
                <button
                  type="button"
                  key={category.value}
                  disabled={category.value === selectedCategory}
                  onClick={() => setSelectedCategory(category.value)}
                  className="rounded border border-solid border-gray-300 px-2 py-1 disabled:bg-gray-300"
                >
                  {`${category.value} ${category.label}`}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="rounded-lg p-1">
            <legend className="font-bold">群組</legend>
            <GroupSelector
              selectedGroup={groupId}
              selectedMemberEmail={memberEmail}
              onSelectGroup={setGroupId}
              onSelectMemberEmail={setMemberEmail}
            />
          </fieldset>
        </div>
        <fieldset className="p-1">
          <legend className="font-bold">金額</legend>
          <div className="rounded-lg bg-gray-300 p-1">
            <div className="grid w-full grid-cols-2 gap-2 p-1">
              <input
                list="common-description"
                id="description"
                name="description"
                className="col-span-1 rounded bg-background px-2 py-1 focus:outline-0"
                autoComplete="off"
                placeholder="描述"
              />
              <datalist id="common-description">
                <option value="早餐"></option>
                <option value="午餐"></option>
                <option value="晚餐"></option>
                <option value="點心"></option>
                <option value="飲料"></option>
                <option value="加油"></option>
                <option value="薪水"></option>
                <option value="加值(悠遊)"></option>
                <option value="加值(高鐵)"></option>
              </datalist>
              <input
                type="text"
                className={`col-span-1 rounded border border-solid bg-background px-2 py-1 text-end focus:outline-0 ${isNoAmount ? 'border-red-500' : 'border-transparent'}`}
                value={'$ ' + amount}
                readOnly
              />
            </div>
            <NumberKeyboard
              ref={numberKeyboardRef}
              default={data.amount}
              onChange={setAmount}
            />
          </div>
        </fieldset>
        <div className="flex w-full items-center justify-end py-2">
          <button
            disabled={loading}
            type="submit"
            className="flex w-36 items-center justify-center rounded-lg bg-text p-2 text-background"
          >
            {loading && (
              <Loading className="size-4 animate-spin py-1 text-white" />
            )}
            {!loading && <span>送出</span>}
          </button>
        </div>
      </form>
    </Modal>
  );
};
