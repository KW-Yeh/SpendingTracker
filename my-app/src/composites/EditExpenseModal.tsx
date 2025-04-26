'use client';
import { DatePicker } from '@/components/DatePicker';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard, NumberKeyboardRef } from '@/components/NumberKeyboard';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { putItem } from '@/services/getRecords';
import {
  DEFAULT_DESC,
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
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
  const { currentGroup } = useGroupCtx();
  const numberKeyboardRef = useRef<NumberKeyboardRef>(null);
  const [spendingType, setSpendingType] = useState<string>(data.type);
  const [necessity, setNecessity] = useState<string>(data.necessity);
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [description, setDescription] = useState(data.description);
  const [commonDescMap, setCommonDescMap] = useState<Record<string, string[]>>(
    data.desc ?? DEFAULT_DESC,
  );
  const [amount, setAmount] = useState(data.amount);
  const [isNoAmount, setIsNoAmount] = useState(false);
  const [date, setDate] = useState(data.date);
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

  const isNewDesc = useMemo(
    () => !commonDescMap[selectedCategory].includes(description),
    [commonDescMap, description, selectedCategory],
  );

  const handleSetSpendingType = (type: string) => {
    setSpendingType(type);
    const categories = getSpendingCategories(type);
    setSpendingCategories(categories);
    setSelectedCategory(categories[0].value);
  };

  const handleOnChangeDate = (event: ChangeEvent) => {
    const _date = new Date((event.target as HTMLInputElement).value);
    setDate(_date.toISOString());
  };

  const handleSetCommonDesc = useCallback(() => {
    setCommonDescMap((prevState) => {
      const newState = { ...prevState };
      if (!isNewDesc) {
        newState[selectedCategory] = newState[selectedCategory].filter(
          (desc) => desc !== description,
        );
      } else {
        newState[selectedCategory].push(description);
      }
      return newState;
    });
  }, [description, isNewDesc, selectedCategory]);

  const cancel = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const handleOnSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const userEmail = userData?.email;
      if (!userEmail) return;
      if (amount === 0) {
        setIsNoAmount(true);
        return;
      }
      setLoading(true);
      const newSpending: SpendingRecord = {
        ...data,
        id: data.id || uuid(),
        'user-token': userEmail,
        groupId: currentGroup?.id,
        type: spendingType,
        date,
        necessity,
        category: selectedCategory,
        description,
        amount,
      };

      await putItem(newSpending);
      const { startDate, endDate } = getStartEndOfMonth(date);
      syncData(
        currentGroup?.id,
        userEmail,
        startDate.toISOString(),
        endDate.toISOString(),
      );
      setLoading(false);
      if (onClose) onClose();
    },
    [
      userData?.email,
      amount,
      data,
      currentGroup?.id,
      spendingType,
      date,
      necessity,
      selectedCategory,
      description,
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
                defaultColor: 'hsl(0, 0%, 50%)',
                className: '!px-2 !py-1',
              }}
              option2={{
                label: '收入',
                value: SpendingType.Income,
                onSelectColor: '#48BB78',
                defaultColor: 'hsl(0, 0%, 50%)',
                className: '!px-2 !py-1',
              }}
              value={spendingType}
              className="h-10 flex-1 border border-solid border-gray-300 bg-gray-300 text-sm"
              onChange={handleSetSpendingType}
            />
            <Switch
              option1={{
                label: '必要支出',
                value: Necessity.Need,
                onSelectColor: '#ED8936',
                defaultColor: 'hsl(0, 0%, 50%)',
                className: '!px-2 !py-1',
              }}
              option2={{
                label: '額外支出',
                value: Necessity.NotNeed,
                defaultColor: 'hsl(0, 0%, 50%)',
                className: '!px-2 !py-1',
              }}
              value={necessity}
              className="h-10 flex-1 border border-solid border-gray-300 bg-gray-300 text-sm"
              onChange={setNecessity}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <GroupSelector className="h-10 w-full rounded-md" />
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
                value={selectedCategory}
                label={
                  <span className="flex items-center gap-2">
                    {getCategoryIcon(selectedCategory)}
                    <span>{selectedCategoryLabel}</span>
                  </span>
                }
                onChange={setSelectedCategory}
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors hover:border-gray-500 active:border-gray-500"
              >
                {spendingCategories.map((category) => (
                  <Select.Item key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(category.value)}
                      <span>{category.label}</span>
                    </span>
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
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                defaultValue={data.description}
              />
              <datalist id="common-description">
                {commonDescMap[selectedCategory]?.map((commonDesc) => (
                  <option key={commonDesc} value={commonDesc}></option>
                ))}
              </datalist>
            </fieldset>
          </div>
          <div
            className={`grid w-full transition-all duration-300 ${description !== '' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <button
                type="button"
                className="border-text bg-text text-background w-full rounded-lg border border-solid p-2 font-semibold transition-colors hover:bg-gray-800 active:bg-gray-800"
                onClick={handleSetCommonDesc}
              >
                {!isNewDesc ? '- 刪除常用描述' : '+ 新增常用描述'}
              </button>
            </div>
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
            className="bg-background flex w-24 items-center justify-center rounded-lg border border-solid border-red-300 p-2 text-red-300 transition-colors hover:border-red-500 hover:text-red-500 active:border-red-500 active:text-red-500"
          >
            <span>取消</span>
          </button>
          <button
            disabled={loading}
            type="submit"
            className="submit-button flex w-36 items-center justify-center"
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
