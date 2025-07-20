'use client';
import { DatePicker } from '@/components/DatePicker';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard } from '@/components/NumberKeyboard';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { useDateCtx } from '@/context/DateProvider';
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
import { getSpendingCategoryMap } from '@/utils/getSpendingCategoryMap';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { v7 as uuid } from 'uuid';

interface Props {
  data: SpendingRecord;
  isNewData: boolean;
  onClose?: () => void;
}

export const EditExpenseModal = (props: Props) => {
  const { data, isNewData, onClose } = props;
  const { config: userData, setter: updateUser, syncUser } = useUserConfigCtx();
  const { syncData } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const { date } = useDateCtx();
  const [spendingType, setSpendingType] = useState<string>(data.type);
  const [necessity, setNecessity] = useState<string>(data.necessity);
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [description, setDescription] = useState(data.description);
  const [amount, setAmount] = useState(data.amount);
  const [isNoAmount, setIsNoAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spendingCategories, setSpendingCategories] = useState<
    {
      value: string;
      label: string;
    }[]
  >(data.type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP);
  const [updatingCategory, setUpdatingCategory] = useState(false);

  const selectedCategoryLabel = useMemo(
    () =>
      spendingCategories.find((item) => item.value === selectedCategory)?.label,
    [selectedCategory, spendingCategories],
  );

  const descriptionList = useMemo(
    () => ({ ...DEFAULT_DESC, ...(userData?.desc ?? {}) })[selectedCategory],
    [selectedCategory, userData?.desc],
  );

  const isNewDesc = useMemo(
    () => !descriptionList.includes(description),
    [description, descriptionList],
  );

  const handleSetSpendingType = (type: string) => {
    setSpendingType(type);
    const categories = getSpendingCategoryMap(type);
    setSpendingCategories(categories);
    setSelectedCategory(categories[0].value);
  };

  const handleSetCommonDesc = useCallback(
    (isNew: boolean) => {
      if (!userData) return;
      setUpdatingCategory(true);
      const commonDescMap = { ...userData.desc };
      if (isNew) {
        const newCategories = commonDescMap[selectedCategory] ?? [];
        if (!newCategories.includes(description)) {
          newCategories.push(description);
        }
        commonDescMap[selectedCategory] = newCategories;
      } else {
        const newCategories = commonDescMap[selectedCategory] ?? [];
        const index = newCategories.findIndex((item) => item === description);
        if (index !== -1) {
          newCategories.splice(index, 1);
        }
        commonDescMap[selectedCategory] = newCategories;
      }
      updateUser({
        ...userData,
        desc: commonDescMap,
      }).then(() => {
        syncUser();
        setUpdatingCategory(false);
      });
    },
    [description, selectedCategory, syncUser, updateUser, userData],
  );

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
        date: date.toISOString(),
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
      amount,
      currentGroup?.id,
      data,
      date,
      description,
      necessity,
      onClose,
      selectedCategory,
      spendingType,
      syncData,
      userData?.email,
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
      className="flex w-full flex-col self-end sm:max-w-96 sm:self-center sm:rounded-xl"
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
              }}
              option2={{
                label: '收入',
                value: SpendingType.Income,
              }}
              value={spendingType}
              className="h-10 flex-1 border border-solid border-gray-300 text-sm"
              onChange={handleSetSpendingType}
            />
            <Switch
              option1={{
                label:
                  spendingType === SpendingType.Outcome
                    ? '必要支出'
                    : '必要收入',
                value: Necessity.Need,
              }}
              option2={{
                label:
                  spendingType === SpendingType.Outcome
                    ? '額外支出'
                    : '額外收入',
                value: Necessity.NotNeed,
              }}
              value={necessity}
              className="h-10 flex-1 border border-solid border-gray-300 text-sm"
              onChange={setNecessity}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
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
            <DatePicker
              className="h-10 flex-1 rounded-md border border-solid border-gray-300 bg-transparent"
              labelClassName="text-base px-2 py-1"
              format="yyyy/mm/dd"
              init={new Date(data.date)}
            />
          </div>
          <div className="group flex w-full items-center">
            <fieldset className="flex-1">
              <input
                type="text"
                id="description"
                name="description"
                className="h-10 w-full rounded-md rounded-r-none border border-r-0 border-solid border-gray-300 px-2 py-1 transition-colors group-hover:border-gray-500 group-active:border-gray-500 focus:outline-0"
                autoComplete="off"
                placeholder="描述"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
            </fieldset>
            <fieldset className="w-10">
              <Select
                name="category"
                onChange={setDescription}
                className="h-10 w-10 justify-center rounded-md rounded-l-none border border-l-0 border-solid border-gray-300 px-3 py-1 transition-colors group-hover:border-gray-500 group-active:border-gray-500"
                menuStyle="min-w-24"
              >
                {descriptionList.map((commonDesc) => (
                  <Select.Item
                    key={commonDesc}
                    value={commonDesc}
                    className="justify-center"
                  >
                    <span>{commonDesc}</span>
                  </Select.Item>
                ))}
                {descriptionList.length === 0 && (
                  <Select.Item value="" className="justify-center">
                    <span>尚未設定</span>
                  </Select.Item>
                )}
              </Select>
            </fieldset>
          </div>
          <button
            type="button"
            disabled={description === '' || updatingCategory}
            className={`border-text bg-text text-background w-full rounded-lg border border-solid p-2 font-semibold transition-colors hover:bg-gray-800 active:bg-gray-800 disabled:!cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 ${description === '' ? 'hidden' : ''}`}
            onClick={() => handleSetCommonDesc(isNewDesc)}
          >
            {updatingCategory
              ? '更新資料中...'
              : !isNewDesc
                ? '- 刪除常用描述'
                : '+ 新增常用描述'}
          </button>
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
          <NumberKeyboard default={data.amount} onChange={setAmount} />
        </div>
        <div className="flex w-full flex-1 items-end justify-between py-2">
          <button
            disabled={loading}
            type="button"
            onClick={cancel}
            className="bg-background flex w-24 items-center justify-center rounded-lg border border-solid border-gray-300 p-2 text-gray-300 transition-colors hover:border-gray-500 hover:text-gray-500 active:border-gray-500 active:text-gray-500"
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
