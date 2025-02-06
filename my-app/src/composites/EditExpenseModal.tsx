'use client';
import { DatePicker } from '@/components/DatePicker';
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
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useSession } from 'next-auth/react';
import {
  ChangeEvent,
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
  const [date, setDate] = useState(data.date);
  const [groupId, setGroupId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const spendingCategories = useMemo(
    () =>
      spendingType === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP,
    [spendingType],
  );

  const handleOnChangeDate = (event: ChangeEvent) => {
    const _date = new Date((event.target as HTMLInputElement).value);
    setDate(_date.toUTCString());
  };

  const handleToPreviousDay = useCallback(() => {
    const _date = new Date(date);
    _date.setDate(_date.getDate() - 1);
    setDate(_date.toUTCString());
  }, [date]);

  const handleToNextDay = useCallback(() => {
    const _date = new Date(date);
    _date.setDate(_date.getDate() + 1);
    setDate(_date.toUTCString());
  }, [date]);

  const resetStates = useCallback(() => {
    setSpendingType(SpendingType.Outcome);
    setNecessity(Necessity.Need);
    setSelectedCategory('');
    setAmount(0);
    setGroupId(undefined);
  }, []);

  const cancel = useCallback(() => {
    reset();
    resetStates();
    ref.current?.close();
  }, [ref, reset, resetStates]);

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
        date,
        necessity,
        category: selectedCategory,
        description,
        amount,
      };

      await putItem(newSpending);
      syncData(groupId, userEmail);
      setLoading(false);
      reset();
      resetStates();
      ref.current?.close();
    },
    [
      session?.user?.email,
      amount,
      data,
      groupId,
      spendingType,
      date,
      necessity,
      selectedCategory,
      syncData,
      reset,
      resetStates,
      ref,
    ],
  );

  useEffect(() => {
    if (amount !== 0) {
      setIsNoAmount(false);
    }
  }, [amount]);

  useEffect(() => {
    setSpendingType(data.type);
    setNecessity(data.necessity);
    setSelectedCategory(data.category);
    setAmount(data.amount);
    setMemberEmail(data['user-token']);
    setGroupId(data.groupId);
    setLoading(false);
  }, [data]);

  return (
    <Modal
      ref={ref}
      onClose={cancel}
      className="flex w-full max-w-96 flex-col"
      title={isNewData ? '新增記錄' : '修改記錄'}
    >
      <form
        className="flex w-full flex-1 flex-col gap-2"
        onSubmit={handleOnSubmit}
      >
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2">
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
          <fieldset className="w-full rounded-lg p-1">
            <legend className="font-bold">類型</legend>
            <div className="grid w-full grid-cols-1 overflow-hidden">
              <div className="scrollbar col-span-1 flex items-center gap-2 overflow-x-auto max-sm:pb-2">
                {spendingCategories.map((category) => (
                  <button
                    type="button"
                    key={category.value}
                    disabled={category.value === selectedCategory}
                    onClick={() => setSelectedCategory(category.value)}
                    className="shrink-0 rounded border border-solid border-gray-300 px-2 py-1 disabled:bg-gray-300"
                  >
                    {`${category.value} ${category.label}`}
                  </button>
                ))}
              </div>
            </div>
          </fieldset>
        </div>
        <div className="flex items-center gap-2">
          <span>群組</span>
          <GroupSelector
            selectedGroup={groupId}
            selectedMemberEmail={memberEmail}
            onSelectGroup={setGroupId}
            onSelectMemberEmail={setMemberEmail}
          />
        </div>
        <div className="flex flex-col rounded-lg bg-gray-300 p-1">
          <div className="flex w-full items-center justify-between px-2">
            <DatePicker
              date={new Date(date)}
              className="bg-transparent py-1 text-base"
              onChange={handleOnChangeDate}
            />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleToPreviousDay}
                className="size-6 rounded-full transition-colors active:bg-gray-500 active:text-background sm:hover:bg-gray-500 sm:hover:text-background"
              >
                {'<'}
              </button>
              <button
                type="button"
                onClick={handleToNextDay}
                className="size-6 rounded-full transition-colors active:bg-gray-500 active:text-background sm:hover:bg-gray-500 sm:hover:text-background"
              >
                {'>'}
              </button>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 p-1">
            <input
              list="common-description"
              id="description"
              name="description"
              className="col-span-1 rounded bg-background px-2 py-1 focus:outline-0"
              autoComplete="off"
              placeholder="描述"
              defaultValue={data.description}
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
              value={'$ ' + normalizeNumber(amount)}
              readOnly
            />
          </div>
          <NumberKeyboard
            ref={numberKeyboardRef}
            default={data.amount}
            onChange={setAmount}
          />
        </div>
        <div className="flex w-full flex-1 items-end justify-between py-2">
          <button
            disabled={loading}
            type="button"
            onClick={cancel}
            className="flex w-24 items-center justify-center rounded-lg border border-solid border-red-300 bg-background p-2 text-red-300 transition-colors active:border-red-500 active:text-red-500 sm:hover:border-red-500 sm:hover:text-red-500"
          >
            <span>取消</span>
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex w-36 items-center justify-center rounded-lg border border-solid border-text bg-text p-2 text-background transition-all active:bg-gray-600 sm:hover:bg-gray-600"
          >
            {loading && (
              <Loading className="size-6 animate-spin py-1 text-white" />
            )}
            {!loading && <span>送出</span>}
          </button>
        </div>
      </form>
    </Modal>
  );
};
