'use client';
import { DatePicker } from '@/components/DatePicker';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard, NumberKeyboardRef } from '@/components/NumberKeyboard';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { putItem } from '@/services/recordActions';
import {
  DEFAULT_DESC,
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  ChangeEvent,
  FormEvent,
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
  onClose?: () => void;
}

export const EditExpenseModal = (props: Props) => {
  const { data, isNewData, onClose } = props;
  const { config: userData } = useUserConfigCtx();
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
  const [spendingCategories, setSpendingCategories] = useState<
    {
      value: string;
      label: string;
    }[]
  >(data.type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP);

  const getSpendingCategories = (type: string) => {
    return type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP;
  };

  const selectedCategoryLabel = useMemo(
    () =>
      spendingCategories.find((item) => item.value === selectedCategory)?.label,
    [selectedCategory, spendingCategories],
  );

  const handleSetSpendingType = (type: string) => {
    setSpendingType(type);
    const categories = getSpendingCategories(type);
    setSpendingCategories(categories);
    setSelectedCategory(categories[0].value);
  };

  const handleOnChangeDate = (event: ChangeEvent) => {
    const _date = new Date((event.target as HTMLInputElement).value);
    setDate(_date.toUTCString());
  };

  const cancel = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const handleOnSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const userEmail = userData?.email;
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
      if (onClose) onClose();
    },
    [
      userData,
      amount,
      data,
      groupId,
      spendingType,
      date,
      necessity,
      selectedCategory,
      syncData,
      onClose,
    ],
  );

  useEffect(() => {
    if (amount !== 0) {
      setIsNoAmount(false);
    }
  }, [amount]);

  return (
    <Modal
      defaultOpen={true}
      onClose={cancel}
      className="flex w-full max-w-96 flex-col"
      title={isNewData ? '新增帳目' : '編輯帳目'}
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
                onSelectColor: '#F56666',
                className: '!px-2 !py-1',
              }}
              option2={{
                label: '收入',
                value: SpendingType.Income,
                onSelectColor: '#48BB78',
                className: '!px-2 !py-1',
              }}
              value={spendingType}
              className="h-10 flex-1 text-sm"
              onChange={handleSetSpendingType}
            />
            <Switch
              option1={{
                label: '必要支出',
                value: Necessity.Need,
                onSelectColor: '#ED8936',
                className: '!px-2 !py-1',
              }}
              option2={{
                label: '額外支出',
                value: Necessity.NotNeed,
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
              format="yyyy/mm/dd"
              onChange={handleOnChangeDate}
            />
          </div>
          <div className="flex w-full items-center gap-4">
            <fieldset className="flex-1">
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
                {DEFAULT_DESC[selectedCategory]?.map((commonDesc) => (
                  <option key={commonDesc} value={commonDesc}></option>
                ))}
              </datalist>
            </fieldset>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div
            className={`flex w-full items-center rounded-md border border-solid bg-white px-2 ${isNoAmount ? 'border-red-500' : 'border-gray-300'}`}
          >
            <span className="text-sm text-gray-500">金額</span>
            <input
              type="text"
              className="h-10 flex-1 bg-transparent py-1 text-end focus:outline-0"
              value={normalizeNumber(amount)}
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
