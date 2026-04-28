'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import {
  CATEGORY_WORDING_MAP,
  Necessity,
  SpendingType,
} from '@/utils/constants';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { getSpendingCategoryMap } from '@/utils/getSpendingCategoryMap';
import { normalizeNumber } from '@/utils/normalizeNumber';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useCallback, useMemo, useState } from 'react';

interface Props {
  spending: SpendingRecord;
  refreshData: () => void;
}

export const SpendingItem = (props: Props) => {
  const { spending, refreshData } = props;
  const { config: userData } = useUserConfigCtx();
  const { deleteRecord } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // 檢查當前用戶是否為此交易的創建者
  const canEdit = useMemo(() => {
    return userData?.email === spending['user-token'];
  }, [userData?.email, spending]);

  const categories = useMemo(
    () => getSpendingCategoryMap(spending.type),
    [spending.type],
  );

  const category = useMemo(
    () => categories.find((cat) => cat.value === spending.category),
    [categories, spending.category],
  );

  const additionalStyle = useMemo(() => {
    if (deleting) {
      return 'ring-2 ring-[var(--color-expense)]';
    }
    return 'hover:bg-white/[0.03] cursor-pointer';
  }, [deleting]);

  const handleOnDelete = useCallback(async () => {
    if (!confirm('確定要刪除這筆資料嗎?')) return;
    if (!currentGroup?.account_id) return;
    setDeleting(true);
    await deleteRecord(spending.id, currentGroup.account_id);
    startTransition(() => {
      setDeleting(false);
      refreshData();
    });
  }, [refreshData, spending.id, currentGroup?.account_id, deleteRecord]);

  const handleAction = useCallback(
    (action: string) => {
      if (action === 'delete') {
        handleOnDelete();
      } else if (action === 'edit') {
        router.push(`/edit?id=${spending.id}`);
      }
    },
    [handleOnDelete, router, spending.id],
  );

  // Format time display
  const timeInfo = useMemo(() => {
    const date = new Date(spending.date);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return {
      period,
      time: `${displayHours}:${minutes}`,
    };
  }, [spending.date]);

  const isNeed = spending.necessity === Necessity.Need;

  return (
    <div
      className={`relative flex items-center gap-3 rounded-[14px] border border-white/[0.06] bg-gray-800/80 px-3 py-2.5 text-sm backdrop-blur-sm transition-colors sm:text-base ${additionalStyle} ${menuOpen ? 'z-10' : ''}`}
    >
      {deleting && (
        <span
          className="absolute top-0 left-2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md"
          style={{ backgroundColor: 'var(--color-expense)' }}
        >
          刪除中
        </span>
      )}
      {category && (
        <span
          title={CATEGORY_WORDING_MAP[category.value]}
          className="flex size-9 items-center justify-center rounded-[10px] bg-gray-700/60"
          style={
            isNeed
              ? { boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.3)' }
              : undefined
          }
        >
          {getCategoryIcon(
            category.value,
            `size-5 ${isNeed ? 'text-primary-400' : 'text-gray-400'}`,
          )}
        </span>
      )}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div
          title={spending.description}
          className="overflow-hidden text-[13.5px] font-semibold text-ellipsis whitespace-nowrap text-gray-100 sm:text-sm"
        >
          {spending.description}
        </div>
        <div
          className="flex items-center gap-1 text-[10.5px] font-medium text-gray-400"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <span>{timeInfo.time}</span>
          <span aria-hidden>·</span>
          <span>{timeInfo.period}</span>
        </div>
      </div>
      <div
        className="w-fit text-end text-base font-extrabold sm:text-lg"
        style={{
          color:
            spending.type === SpendingType.Outcome
              ? 'var(--color-expense)'
              : 'var(--color-income)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        ${normalizeNumber(Number(spending.amount))}
      </div>
      {canEdit && (
        <ActionMenu
          onClick={handleAction}
          onOpenChange={setMenuOpen}
          options={[
            {
              value: 'edit',
              label: (
                <Link
                  href={`/edit?id=${spending.id}`}
                  className="group-hover:text-primary-400 group-active:text-primary-300 flex items-center gap-3 text-gray-300 transition-colors"
                >
                  <EditIcon className="size-4 transition-colors sm:size-4" />
                  <span className="font-medium">編輯</span>
                </Link>
              ),
            },
            {
              value: 'delete',
              label: (
                <span className="group flex items-center gap-3 text-gray-300 transition-colors group-hover:text-[var(--color-expense)] group-active:text-[var(--color-expense)]">
                  <DeleteIcon className="size-4 transition-colors sm:size-4" />
                  <span className="font-medium">刪除</span>
                </span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};
