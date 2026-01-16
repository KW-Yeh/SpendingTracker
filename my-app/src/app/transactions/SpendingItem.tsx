'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { deleteItem } from '@/services/getRecords';
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
  const [deleting, setDeleting] = useState(false);
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
      return 'ring-2 ring-secondary-400';
    }
    return 'hover:shadow-md hover:border-primary-200 cursor-pointer';
  }, [deleting]);

  const handleOnDelete = useCallback(() => {
    if (!confirm('確定要刪除這筆資料嗎?')) return;
    setDeleting(true);
    deleteItem(spending.id).then(() => {
      startTransition(() => {
        setDeleting(false);
        refreshData();
      });
    });
  }, [refreshData, spending.id]);

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

  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl bg-white border border-gray-200 p-3 text-sm transition-all shadow-sm sm:text-base md:p-4 ${additionalStyle}`}
    >
      {deleting && (
        <span className="absolute top-0 left-2 -translate-y-1/2 rounded-full bg-secondary-500 px-3 py-1 text-xs font-bold text-white shadow-md">
          刪除中
        </span>
      )}
      {category && (
        <span
          title={CATEGORY_WORDING_MAP[category.value]}
          className="flex size-10 items-center justify-center rounded-xl bg-primary-50"
        >
          {getCategoryIcon(
            category.value,
            `size-6 ${spending.necessity === Necessity.Need ? 'text-primary-600' : 'text-gray-300'}`,
          )}
        </span>
      )}
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div
          title={spending.description}
          className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-gray-800"
        >
          {spending.description}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
            {timeInfo.period}
          </span>
          <span className="text-xs font-medium text-gray-300">{timeInfo.time}</span>
        </div>
      </div>
      <div
        className={`w-fit text-end font-bold text-lg ${spending.type === SpendingType.Outcome ? 'text-secondary-600' : 'text-income-600'}`}
      >
        ${normalizeNumber(Number(spending.amount))}
      </div>
      {canEdit && (
        <ActionMenu
          onClick={handleAction}
          options={[
            {
              value: 'edit',
              label: (
                <Link
                  href={`/edit?id=${spending.id}`}
                  className="text-gray-700 group-hover:text-primary-600 group-active:text-primary-700 flex items-center gap-3 transition-colors"
                >
                  <EditIcon className="size-4 transition-colors sm:size-4" />
                  <span className="font-medium">編輯</span>
                </Link>
              ),
            },
            {
              value: 'delete',
              label: (
                <span className="group text-gray-700 flex items-center gap-3 transition-colors group-hover:text-secondary-600 group-active:text-secondary-700">
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
