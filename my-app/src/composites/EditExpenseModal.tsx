'use client';
import { DatePicker } from '@/components/DatePicker';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard, NumberKeyboardRef } from '@/components/NumberKeyboard';
import { Select } from '@/components/Select';
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

  const selectedCategoryLabel = useMemo(
    () =>
      spendingCategories.find((item) => item.value === selectedCategory)?.label,
    [selectedCategory, spendingCategories],
  );

  const handleOnChangeDate = (event: ChangeEvent) => {
    const _date = new Date((event.target as HTMLInputElement).value);
    setDate(_date.toUTCString());
  };

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
      syncData(groupId, userEmail, date);
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
        className="flex w-full flex-1 flex-col gap-4"
        onSubmit={handleOnSubmit}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Switch
              option1={{
                label: '支出',
                value: SpendingType.Outcome,
                onSelectColor: '#d1d5db',
                className: '!px-2 !py-1',
              }}
              option2={{
                label: '收入',
                value: SpendingType.Income,
                onSelectColor: '#d1d5db',
                className: '!px-2 !py-1',
              }}
              value={spendingType}
              className="h-10 flex-1 text-sm"
              onChange={setSpendingType}
            />
            <Switch
              option1={{
                label: '必要開銷',
                value: Necessity.Need,
                onSelectColor: '#d1d5db',
                className: '!px-2 !py-1',
              }}
              option2={{
                label: '額外開銷',
                value: Necessity.NotNeed,
                onSelectColor: '#d1d5db',
                className: '!px-2 !py-1',
              }}
              value={necessity}
              className="h-10 flex-1 text-sm"
              onChange={setNecessity}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-solid border-gray-300">
              <GroupSelector
                selectedGroup={groupId}
                selectedMemberEmail={memberEmail}
                onSelectGroup={setGroupId}
                onSelectMemberEmail={setMemberEmail}
                showMemberSelector={false}
                selectorStyle="border-0 w-full h-10"
              />
            </div>
            <DatePicker
              date={new Date(date)}
              className="h-10 flex-1 rounded-md border border-solid border-gray-300 bg-transparent"
              labelClassName="text-base px-2 py-1"
              onChange={handleOnChangeDate}
            />
          </div>
          <div className="flex w-full items-center gap-4">
            <fieldset className="flex-1">
              {/*<legend className="font-bold">類型</legend>*/}
              <Select
                name="category"
                value={`${selectedCategory} ${selectedCategoryLabel}`}
                onChange={setSelectedCategory}
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors active:border-text sm:hover:border-text"
              >
                {spendingCategories.map((category) => (
                  <Select.Item key={category.value} value={category.value}>
                    {`${category.value} ${category.label}`}
                  </Select.Item>
                ))}
              </Select>
            </fieldset>
            <fieldset className="flex-1">
              {/*<legend className="font-bold">描述</legend>*/}
              <input
                list="common-description"
                id="description"
                name="description"
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-2 py-1 focus:outline-0"
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
            </fieldset>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-lg">
          <input
            type="text"
            className={`h-10 w-full rounded border border-solid px-2 py-1 text-end focus:outline-0 ${isNoAmount ? 'border-red-500' : 'border-gray-300'}`}
            value={'$ ' + normalizeNumber(amount)}
            readOnly
          />
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
