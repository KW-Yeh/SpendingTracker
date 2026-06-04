'use client';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { Loading } from '@/components/icons/Loading';
import { NumberKeyboard } from '@/components/NumberKeyboard';
import { Switch } from '@/components/Switch';
import { DatePicker } from '@/components/DatePicker';
import { useDateCtx } from '@/context/DateProvider';
import { useFavoriteCategoriesCtx } from '@/context/FavoriteCategoriesProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import useFocusRef from '@/hooks/useFocusRef';
import {
  CATEGORY_WORDING_MAP,
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { getSpendingCategoryMap } from '@/utils/getSpendingCategoryMap';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { IoArrowBack, IoCheckmarkSharp } from 'react-icons/io5';
import { v7 as uuid } from 'uuid';

interface Props {
  data: SpendingRecord;
  isNewData: boolean;
  onClose?: () => void;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

type Step = 1 | 2;

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

  // Shared state — preserved across step transitions
  const [step, setStep] = useState<Step>(1);
  const [spendingType, setSpendingType] = useState<string>(data.type);
  const [necessity, setNecessity] = useState<string>(data.necessity);
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [description, setDescription] = useState(data.description);
  // Amount stored as string so the keyboard can render trailing decimals like "12."
  const [amountStr, setAmountStr] = useState<string>(
    data.amount && Number(data.amount) > 0 ? data.amount.toString() : '0',
  );
  const [isNoAmount, setIsNoAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);

  const isIncome = spendingType === SpendingType.Income;
  const amountNum = Number(amountStr) || 0;

  const spendingCategories = useMemo(
    () =>
      spendingType === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP,
    [spendingType],
  );

  const selectedCategoryLabel = useMemo(
    () =>
      spendingCategories.find((c) => c.value === selectedCategory)?.label ??
      CATEGORY_WORDING_MAP[selectedCategory] ??
      '',
    [selectedCategory, spendingCategories],
  );

  const descriptionList = useMemo(
    () => getCategoryDescriptions(selectedCategory),
    [selectedCategory, getCategoryDescriptions],
  );

  const isNewDesc = useMemo(
    () => description !== '' && !descriptionList.includes(description),
    [description, descriptionList],
  );

  // Initialize date context once on mount
  useEffect(() => {
    setDate(isNewData ? new Date() : new Date(data.date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync favorites for current user
  useEffect(() => {
    if (userData?.user_id) syncFavorites(userData.user_id);
  }, [userData?.user_id, syncFavorites]);

  // Clear "no amount" flag once user enters something
  useEffect(() => {
    if (amountNum > 0) setIsNoAmount(false);
  }, [amountNum]);

  // Switching type: if current category isn't in the new list, fall back to first
  const handleSetSpendingType = (type: string) => {
    setSpendingType(type);
    const cats = getSpendingCategoryMap(type);
    if (!cats.find((c) => c.value === selectedCategory)) {
      setSelectedCategory(cats[0].value);
    }
  };

  const handleAddQuick = (delta: number) => {
    const cur = Number(amountStr) || 0;
    setAmountStr(String(cur + delta));
  };

  // Validate amount before advancing to step 2
  const handleNext = () => {
    if (amountNum === 0) {
      setIsNoAmount(true);
      return;
    }
    setStep(2);
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

  const submitForm = useCallback(async () => {
    const userEmail = userData?.email;
    if (!userEmail) return;
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
      amount: amountNum.toString(),
    };
    if (groupId) {
      if (isNewData) await addRecord(newSpending, groupId);
      else await updateRecord(newSpending, groupId);
    }
    setLoading(false);
    onClose?.();
  }, [
    amountNum,
    addRecord,
    currentGroup?.account_id,
    data,
    date,
    description,
    isNewData,
    necessity,
    onClose,
    selectedCategory,
    spendingType,
    updateRecord,
    userData?.email,
  ]);

  // Header logic — Step 1: ✕ closes; Step 2: ← returns to Step 1
  const handleHeaderLeft = () => {
    if (step === 2) setStep(1);
    else onClose?.();
  };

  return (
    <ModalShell onClose={onClose}>
      <header className="relative flex items-center justify-between gap-3 border-b border-black/[0.08] px-4 py-3">
        <button
          type="button"
          onClick={handleHeaderLeft}
          className="flex size-9 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-black/[0.05] hover:text-gray-100"
          aria-label={step === 2 ? '返回上一步' : '關閉'}
        >
          {step === 2 ? (
            <IoArrowBack className="size-5" />
          ) : (
            <CloseIcon className="size-5" />
          )}
        </button>

        <div className="flex flex-col items-center gap-1 leading-none">
          <span
            className="text-[15px] font-bold text-gray-100"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isNewData ? '新增帳目' : '編輯帳目'}
          </span>
          <span
            className="text-[10px] font-semibold text-gray-400"
            style={{ letterSpacing: '0.12em' }}
          >
            步驟 {step} / 2
          </span>
        </div>

        <StepDots step={step} />
      </header>

      {step === 1 ? (
        <StepAmount
          amountStr={amountStr}
          onChangeAmount={setAmountStr}
          onAddQuick={handleAddQuick}
          isNoAmount={isNoAmount}
          onNext={handleNext}
        />
      ) : (
        <StepDetails
          isIncome={isIncome}
          amountStr={amountStr}
          spendingType={spendingType}
          onSetSpendingType={handleSetSpendingType}
          necessity={necessity}
          onSetNecessity={setNecessity}
          spendingCategories={spendingCategories}
          selectedCategory={selectedCategory}
          onSetSelectedCategory={setSelectedCategory}
          description={description}
          onSetDescription={setDescription}
          descriptionList={descriptionList}
          isNewDesc={isNewDesc}
          updatingCategory={updatingCategory}
          onToggleCommonDesc={handleSetCommonDesc}
          dateInit={new Date(data.date)}
          loading={loading}
          onSubmit={submitForm}
        />
      )}
    </ModalShell>
  );
};

// --------- Modal shell (custom, replaces shared Modal for full header control)

const ModalShell = ({
  onClose,
  children,
}: {
  onClose?: () => void;
  children: ReactNode;
}) => {
  const contentRef = useFocusRef<HTMLDivElement>(() => onClose?.());

  // Match shared Modal: lock body scroll while open
  useEffect(() => {
    document.body.style.position = 'fixed';
    return () => {
      document.body.style.position = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        ref={contentRef}
        className="animate-modal flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-[24px] border border-black/[0.08] bg-gray-950 shadow-xl sm:max-w-md sm:rounded-2xl"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        {children}
      </div>
    </div>
  );
};

// --------- Step indicator dots

const StepDots = ({ step }: { step: Step }) => (
  <div className="flex size-9 items-center justify-center gap-1">
    <span
      aria-hidden
      className="h-1.5 rounded-full transition-all"
      style={{
        width: step === 1 ? 16 : 6,
        backgroundColor:
          step === 1 ? 'var(--color-primary-500)' : 'rgba(0,0,0,0.15)',
      }}
    />
    <span
      aria-hidden
      className="h-1.5 rounded-full transition-all"
      style={{
        width: step === 2 ? 16 : 6,
        backgroundColor:
          step === 2 ? 'var(--color-primary-500)' : 'rgba(0,0,0,0.15)',
      }}
    />
  </div>
);

// --------- Step 1: 輸入金額 (How much)

interface StepAmountProps {
  amountStr: string;
  onChangeAmount: (s: string) => void;
  onAddQuick: (delta: number) => void;
  isNoAmount: boolean;
  onNext: () => void;
}

const StepAmount = ({
  amountStr,
  onChangeAmount,
  onAddQuick,
  isNoAmount,
  onNext,
}: StepAmountProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4 pb-3">
        {/* Big amount display */}
        <div className="flex flex-col items-center gap-2 py-2">
          <span
            className="text-[11px] font-semibold uppercase"
            style={{
              letterSpacing: '0.12em',
              color: 'var(--color-text-tertiary)',
            }}
          >
            輸入金額
          </span>
          <div
            className={`flex items-baseline gap-1 ${isNoAmount ? 'animate-pulse' : ''}`}
          >
            <span
              className="font-extrabold text-gray-100"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.75rem, 12vw, 3.5rem)',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              $ {formatAmount(amountStr)}
            </span>
          </div>
          {isNoAmount && (
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--color-expense)' }}
            >
              請輸入金額
            </span>
          )}
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onAddQuick(q)}
              className="rounded-full border border-black/[0.10] bg-black/[0.03] px-3.5 py-1 text-xs font-semibold text-gray-300 transition-colors hover:bg-black/[0.05]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              +{formatAmount(String(q))}
            </button>
          ))}
        </div>

        {/* Calculator */}
        <NumberKeyboard value={amountStr} onChange={onChangeAmount} />
      </div>

      {/* Footer CTA */}
      <div className="border-t border-black/[0.08] px-5 py-3">
        <button
          type="button"
          onClick={onNext}
          className="submit-button flex w-full items-center justify-center"
          style={{ minHeight: 48 }}
        >
          <span>下一步 →</span>
        </button>
      </div>
    </div>
  );
};

// --------- Step 2: 選擇細節 (What)

interface StepDetailsProps {
  isIncome: boolean;
  amountStr: string;
  spendingType: string;
  onSetSpendingType: (t: string) => void;
  necessity: string;
  onSetNecessity: (n: string) => void;
  spendingCategories: { value: string; label: string }[];
  selectedCategory: string;
  onSetSelectedCategory: (v: string) => void;
  description: string;
  onSetDescription: (s: string) => void;
  descriptionList: string[];
  isNewDesc: boolean;
  updatingCategory: boolean;
  onToggleCommonDesc: (isNew: boolean) => Promise<void>;
  dateInit: Date;
  loading: boolean;
  onSubmit: () => void;
}

const StepDetails = ({
  isIncome,
  amountStr,
  spendingType,
  onSetSpendingType,
  necessity,
  onSetNecessity,
  spendingCategories,
  selectedCategory,
  onSetSelectedCategory,
  description,
  onSetDescription,
  descriptionList,
  isNewDesc,
  updatingCategory,
  onToggleCommonDesc,
  dateInit,
  loading,
  onSubmit,
}: StepDetailsProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pt-4 pb-2">
        {/* Amount summary */}
        <div
          className="flex items-baseline justify-between rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <span className="text-sm text-gray-400">金額</span>
          <span
            className="text-lg font-bold"
            style={{
              color: isIncome
                ? 'var(--color-income)'
                : 'var(--color-text-primary)',
            }}
          >
            {isIncome ? '+' : '−'} NT$ {formatAmount(amountStr)}
          </span>
        </div>

        {/* Type segment */}
        <Section label="類型">
          <Switch
            option1={{ label: '支出', value: SpendingType.Outcome }}
            option2={{ label: '收入', value: SpendingType.Income }}
            value={spendingType}
            className="h-10 w-full border border-solid border-black/[0.08] text-sm"
            onChange={onSetSpendingType}
          />
        </Section>

        {/* Necessity segment */}
        <Section label="必要程度">
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
            className="h-10 w-full border border-solid border-black/[0.08] text-sm"
            onChange={onSetNecessity}
          />
        </Section>

        {/* Category grid */}
        <Section label="類別">
          <div className="grid grid-cols-5 gap-2">
            {spendingCategories.map((cat) => {
              const selected = cat.value === selectedCategory;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => onSetSelectedCategory(cat.value)}
                  className="flex flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-2 transition-colors"
                  style={{
                    borderColor: selected
                      ? 'rgba(0, 102, 204, 0.5)'
                      : 'rgba(0,0,0,0.08)',
                    background: selected
                      ? 'rgba(0, 102, 204, 0.08)'
                      : 'rgba(0,0,0,0.02)',
                  }}
                  title={CATEGORY_WORDING_MAP[cat.value] || cat.label}
                >
                  <span
                    className="flex size-5 items-center justify-center"
                    style={{
                      color: selected
                        ? 'var(--color-primary-500)'
                        : 'var(--color-text-tertiary)',
                    }}
                    aria-hidden
                  >
                    {getCategoryIcon(cat.value, 'size-5') ?? cat.value}
                  </span>
                  <span
                    className="text-[10.5px] font-semibold"
                    style={{
                      color: selected
                        ? 'var(--color-primary-500)'
                        : 'var(--color-text-tertiary)',
                    }}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Description + chips */}
        <Section label="描述">
          <input
            type="text"
            id="description"
            name="description"
            className="hover:border-primary-600 h-10 w-full rounded-xl border border-solid border-black/[0.08] bg-black/[0.02] px-3 py-1 text-gray-100 transition-colors placeholder:text-gray-500 focus:outline-0"
            autoComplete="off"
            placeholder="例如：午餐、咖啡、薪水"
            onChange={(e) => onSetDescription(e.target.value)}
            onFocus={(e) => {
              const target = e.target;
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 300);
            }}
            value={description}
          />

          {descriptionList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {descriptionList.map((commonDesc) => (
                <button
                  key={commonDesc}
                  type="button"
                  onClick={() => onSetDescription(commonDesc)}
                  className="rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
                  style={{
                    borderColor:
                      description === commonDesc
                        ? 'rgba(0, 102, 204, 0.5)'
                        : 'rgba(0,0,0,0.10)',
                    background:
                      description === commonDesc
                        ? 'rgba(0, 102, 204, 0.08)'
                        : 'transparent',
                    color:
                      description === commonDesc
                        ? 'var(--color-primary-500)'
                        : 'var(--color-text-tertiary)',
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
              className={`w-full rounded-lg border border-solid p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isNewDesc
                  ? 'border-primary-500 bg-primary-50 text-primary-500'
                  : 'border-[var(--color-expense)]/40 text-[var(--color-expense)]'
              }`}
              onClick={() => onToggleCommonDesc(isNewDesc)}
            >
              {updatingCategory
                ? '更新資料中...'
                : !isNewDesc
                  ? '— 從常用描述移除'
                  : '+ 加到常用描述'}
            </button>
          )}
        </Section>

        {/* Date */}
        <Section label="日期">
          <DatePicker
            className="hover:border-primary-600 h-10 w-full rounded-xl border border-solid border-black/[0.08] bg-black/[0.02] transition-colors"
            labelClassName="text-sm px-3 py-1"
            format="yyyy/mm/dd"
            init={dateInit}
          />
        </Section>
      </div>

      {/* Footer submit */}
      <div className="border-t border-black/[0.08] px-5 py-3">
        {loading ? (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: 48 }}
          >
            <Loading className="size-6 animate-spin text-white" />
          </div>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="submit-button flex w-full items-center justify-center gap-1.5"
            style={{ minHeight: 48 }}
          >
            <IoCheckmarkSharp className="size-5" />
            <span>送出</span>
          </button>
        )}
      </div>
    </div>
  );
};

// --------- Helpers

const Section = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <span
      className="text-[11px] font-semibold text-gray-400 uppercase"
      style={{ letterSpacing: '0.12em' }}
    >
      {label}
    </span>
    {children}
  </div>
);

// Format string-form amounts so we keep trailing decimals like "12." while
// adding thousands separators to the integer portion.
function formatAmount(str: string): string {
  if (!str) return '0';
  const negative = str.startsWith('-');
  const abs = negative ? str.slice(1) : str;
  const [intPart, decPart] = abs.split('.');
  const formatted = (Number(intPart || '0') || 0).toLocaleString('en-US');
  const decSuffix = decPart !== undefined ? '.' + decPart : '';
  return (negative ? '-' : '') + formatted + decSuffix;
}
