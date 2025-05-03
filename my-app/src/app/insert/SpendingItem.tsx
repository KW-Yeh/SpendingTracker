'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { deleteItem } from '@/services/getRecords';
import { SpendingType } from '@/utils/constants';
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
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

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
      return 'shadow-[0_0_0_2px_#fca5a5]';
    }
    return 'active:bg-gray-100 hover:bg-gray-100';
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

  return (
    <div
      className={`expense-item relative flex items-center gap-2 rounded-lg p-2 text-sm transition-all sm:text-base ${additionalStyle}`}
    >
      {deleting && (
        <span className="absolute top-0 left-1 -translate-y-1/2 rounded-full bg-red-300 px-2 text-xs font-bold">
          刪除中
        </span>
      )}
      {category && (
        <span className="bg-primary-300 text-background flex size-6 items-center justify-center rounded-md">
          {getCategoryIcon(category.value)}
        </span>
      )}
      <div
        title={spending.description}
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap sm:col-span-5"
      >
        {spending.description}
      </div>
      <div
        className={`w-fit text-end font-bold ${spending.type === SpendingType.Outcome ? 'text-red-500' : 'text-green-500'}`}
      >
        ${normalizeNumber(spending.amount)}
      </div>
      <ActionMenu
        onClick={handleAction}
        options={[
          {
            value: 'edit',
            label: (
              <Link
                href={`/edit?id=${spending.id}`}
                className="text-primary-500 group-hover:text-text group-active:text-text flex items-center gap-2 rounded p-2 transition-colors"
              >
                <EditIcon className="size-3 transition-colors sm:size-4" />
                <span>編輯</span>
              </Link>
            ),
          },
          {
            value: 'delete',
            label: (
              <span className="group group-hover:text-text group-active:text-text flex items-center gap-2 rounded p-2 text-red-500 transition-colors">
                <DeleteIcon className="size-3 transition-colors sm:size-4" />
                <span>刪除</span>
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};
