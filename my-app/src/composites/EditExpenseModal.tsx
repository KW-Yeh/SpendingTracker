'use client';
import { DatePicker } from '@/components/DatePicker';
import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { NumberKeyboard } from '@/components/NumberKeyboard';
import { Switch } from '@/components/Switch';
import { useDateCtx } from '@/context/DateProvider';
import { useFavoriteCategoriesCtx } from '@/context/FavoriteCategoriesProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import {
  CATEGORY_WORDING_MAP,
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { getSpendingCategoryMap } from '@/utils/getSpendingCategoryMap';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { v7 as uuid } from 'uuid';

interface Props {
  data: SpendingRecord;
  isNewData: boolean;
  onClose?: () => void;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export const EditExpenseModal = (props: Props) => {
  const { data, isNewData, onClose } = props;
  const { config: userData } = useUserConfigCtx();
  const { addRecord, updateRecord } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const { date, setDate } = useDateCtx();
  const {
    getCategoryDescriptions,
    addCategoryDescription,
    removeCategoryDescription,
    syncFavorites,
  } = useFavoriteCategoriesCtx();

  const [spendingType, setSpendingType] = useState<string>(data.type);
  const [necessity, setNecessity] = useState<string>(data.necessity);
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [description, setDescription] = useState(data.description);
  const [amount, setAmount] = useState(Number(data.amount));
  const [isNoAmount, setIsNoAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spendingCategories, setSpendingCategories] = useState<
    { value: string; label: string }[]
  >(data.type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP);
  const [updatingCategory, setUpdatingCategory] = useState(false);

  const descriptionList = useMemo(
    () => getCategoryDescriptions(selectedCategory),
    [selectedCategory, getCategoryDescriptions],
  );

  const isNewDesc = useMemo(
    () => !descriptionList.includes(description),
    [description, descriptionList],
  );

  const isIncome = spendingType === SpendingType.Income;

  const handleSetSpendingType = (type: string) => {
    setSpendingType(type);
    const categories = getSpendingCategoryMap(type);
    setSpendingCategories(categories);
    setSelectedCategory(categories[0].value);
  };

  const handleAddQuick = (delta: number) => {
    setAmount((prev) => prev + delta);
  };

  const handleSetCommonDesc = useCallback(
    async (isNew: boolean) => {
      if (!userData?.user_id || description === '') return;
      setUpdatingCategory(true);
      try {
        if (isNew) {
          await addCategoryDescription(
            selectedCategory,
            description,
            userData.user_id,
          );
        } else {
          await removeCategoryDescription(
            selectedCategory,
            description,
            userData.user_id,
          );
        }
      } catch (error) {
        console.error('更新常用描述失敗:', error);
        alert('更新失敗，請稍後再試');
      } finally {
        setUpdatingCategory(false);
      }
    },
    [
      userData?.user_id,
      description,
      selectedCategory,
      addCategoryDescription,
      removeCategoryDescription,
    ],
  );

  // Initialize date context on modal open: today for new records, record date for edits
  useEffect(() => {
    setDate(isNewData ? new Date() : new Date(data.date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData?.user_id) {
      syncFavorites(userData.user_id);
    }
  }, [userData?.user_id, syncFavorites]);

  useEffect(() => {
    if (amount !== 0) setIsNoAmount(false);
  }, [amount]);

  const cancel = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const submitForm = useCallback(async () => {
    const userEmail = userData?.email;
    if (!userEmail) return;
    if (amount === 0) {
      setIsNoAmount(true);
      return;
    }
    setLoading(true);
    const groupId = currentGroup?.account_id
      ? String(currentGroup.account_id)
      : undefined;
    const newSpending: SpendingRecord = {
      ...data,
      id: data.id || uuid(),
      'user-token': userEmail,
      groupId,
      type: spendingType,
      date: date.toISOString(),
      necessity,
      category: selectedCategory,
      description,
      amount: amount.toString(),
    };
    if (groupId) {
      if (isNewData) await addRecord(newSpending, groupId);
      else await updateRecord(newSpending, groupId);
    }
    setLoading(false);
    onClose?.();
  }, [
    amount,
    currentGroup?.account_id,
    data,
    date,
    description,
    isNewData,
    necessity,
    onClose,
    selectedCategory,
    spendingType,
    addRecord,
    updateRecord,
    userData?.email,
  ]);

  const handleOnSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      await submitForm();
    },
    [submitForm],
  );

  return (
    <Modal
      defaultOpen={true}
      onClose={cancel}
      className="flex w-full flex-col"
      title={isNewData ? '新增帳目' : '編輯帳目'}
    >
      <form
        className="flex w-full flex-1 flex-col gap-5"
        onSubmit={handleOnSubmit}
      >
        {/* Big amount display */}
        <div className="flex flex-col gap-2">
          <span
            className="text-[11px] font-semibold uppercase"
            style={{
              letterSpacing: '0.12em',
              color: isIncome
                ? 'var(--color-income)'
                : 'var(--color-text-tertiary)',
            }}
          >
            {isIncome ? '收入金額' : '支出金額'}
          </span>
          <div
            className={`flex items-baseline gap-2 ${isNoAmount ? 'animate-pulse' : ''}`}
          >
            <span
              className="font-extrabold tabular-nums"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.75rem, 12vw, 3.5rem)',
                fontVariantNumeric: 'tabular-nums',
                color: isIncome ? 'var(--color-income)' : 'var(--color-text-primary)',
              }}
            >
              ${normalizeNumber(amount)}
            </span>
            {isNoAmount && (
              <span
                className="text-xs font-semibold"
                style={{ color: 'var(--color-expense)' }}
              >
                請輸入金額
              </span>
            )}
          </div>

          {/* Quick amount chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleAddQuick(q)}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/[0.06]"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                +{normalizeNumber(q)}
              </button>
            ))}
          </div>
        </div>

        {/* Type + Necessity segments */}
        <div className="flex w-full items-center justify-between gap-3">
          <Switch
            option1={{ label: '支出', value: SpendingType.Outcome }}
            option2={{ label: '收入', value: SpendingType.Income }}
            value={spendingType}
            className="h-9 flex-1 border border-solid border-white/[0.06] text-sm"
            onChange={handleSetSpendingType}
          />
          <Switch
            option1={{
              label: isIncome ? '必要收入' : '必要支出',
              value: Necessity.Need,
            }}
            option2={{
              label: isIncome ? '額外收入' : '額外支出',
              value: Necessity.NotNeed,
            }}
            value={necessity}
            className="h-9 flex-1 border border-solid border-white/[0.06] text-sm"
            onChange={setNecessity}
          />
        </div>

        {/* Category grid */}
        <div>
          <span
            className="mb-2 block text-[11px] font-semibold uppercase text-gray-400"
            style={{ letterSpacing: '0.12em' }}
          >
            類別
          </span>
          <div className="grid grid-cols-5 gap-2">
            {spendingCategories.map((cat) => {
              const selected = cat.value === selectedCategory;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="flex flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-2 transition-colors"
                  style={{
                    borderColor: selected
                      ? 'rgba(6, 182, 212, 0.5)'
                      : 'rgba(255,255,255,0.06)',
                    background: selected
                      ? 'linear-gradient(180deg, rgba(6,182,212,0.18), rgba(6,182,212,0.04))'
                      : 'rgba(255,255,255,0.02)',
                  }}
                  title={CATEGORY_WORDING_MAP[cat.value] || cat.label}
                >
                  <span className="text-xl leading-none" aria-hidden>
                    {cat.value}
                  </span>
                  <span
                    className="text-[10.5px] font-semibold"
                    style={{
                      color: selected
                        ? 'var(--color-primary-400)'
                        : 'var(--color-text-tertiary)',
                    }}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date + description */}
        <div className="flex flex-col gap-3">
          <DatePicker
            className="hover:border-primary-600 h-10 w-full rounded-md border border-solid border-white/[0.06] bg-white/[0.02] transition-colors"
            labelClassName="text-base px-2 py-1"
            format="yyyy/mm/dd"
            init={new Date(data.date)}
          />
          <input
            type="text"
            id="description"
            name="description"
            className="hover:border-primary-600 h-10 w-full rounded-md border border-solid border-white/[0.06] bg-white/[0.02] px-3 py-1 text-gray-100 placeholder:text-gray-500 transition-colors focus:outline-0"
            autoComplete="off"
            placeholder="描述（選填）"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          {/* Common description chips */}
          {descriptionList.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {descriptionList.map((commonDesc) => (
                <button
                  key={commonDesc}
                  type="button"
                  onClick={() => setDescription(commonDesc)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    description === commonDesc
                      ? 'text-primary-300'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  style={{
                    borderColor:
                      description === commonDesc
                        ? 'rgba(6, 182, 212, 0.5)'
                        : 'rgba(255,255,255,0.08)',
                    background:
                      description === commonDesc
                        ? 'rgba(6, 182, 212, 0.10)'
                        : 'transparent',
                  }}
                >
                  {commonDesc}
                </button>
              ))}
            </div>
          )}

          {description !== '' && (
            <button
              type="button"
              disabled={updatingCategory}
              className={`w-full rounded-lg border border-solid p-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isNewDesc
                  ? 'border-primary-700 bg-primary-900/20 text-primary-400'
                  : 'border-[var(--color-expense)]/40 text-[var(--color-expense)]'
              }`}
              onClick={() => handleSetCommonDesc(isNewDesc)}
            >
              {updatingCategory
                ? '更新資料中...'
                : !isNewDesc
                  ? '— 從常用描述移除'
                  : '+ 加到常用描述'}
            </button>
          )}
        </div>

        {/* Number keyboard */}
        <NumberKeyboard
          default={Number(data.amount)}
          onChange={setAmount}
          onSubmit={submitForm}
        />

        {/* Footer */}
        <div className="flex w-full items-center justify-between pt-1">
          <button
            disabled={loading}
            type="button"
            onClick={cancel}
            className="flex w-24 items-center justify-center rounded-lg border border-solid border-white/[0.08] bg-transparent p-2 text-gray-300 transition-colors hover:border-gray-400 hover:text-gray-100"
          >
            <span>取消</span>
          </button>
          <button
            disabled={loading}
            type="submit"
            className="submit-button flex w-36 items-center justify-center"
          >
            {loading ? (
              <Loading className="size-6 animate-spin py-1 text-white" />
            ) : (
              <span>送出</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
