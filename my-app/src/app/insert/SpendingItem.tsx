'use client';

import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { deleteItem } from '@/services/getRecords';
import { Necessity } from '@/utils/constants';
import { formatDate } from '@/utils/formatDate';
import { normalizeNumber } from '@/utils/normalizeNumber';
import Link from 'next/link';
import { startTransition, useCallback, useMemo, useState } from 'react';

interface Props {
  spending: SpendingRecord;
  refreshData: () => void;
}

export const SpendingItem = (props: Props) => {
  const { spending, refreshData } = props;
  const [deleting, setDeleting] = useState(false);

  const additionalStyle = useMemo(() => {
    if (deleting) {
      return 'shadow-[0_0_0_2px_#fca5a5]';
    }
    return 'active:bg-background-gray sm:hover:bg-background-gray';
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

  return (
    <div
      className={`relative flex h-12 items-center gap-2 px-2 transition-all ${additionalStyle}`}
    >
      {deleting && (
        <span className="absolute left-1 top-0 -translate-y-1/2 rounded-full bg-red-300 px-2 text-xs font-bold">
          刪除中
        </span>
      )}
      {spending.necessity === Necessity.NotNeed ? (
        <span className="rounded-full border border-solid border-text px-2 py-px text-xs">
          額外
        </span>
      ) : (
        <span className="rounded-full border border-solid border-orange-500 px-2 py-px text-xs">
          必要
        </span>
      )}
      <div className="w-9 text-center text-xs sm:col-span-1">
        {formatDate(spending.date)}
      </div>
      <div
        title={spending.description}
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-base sm:col-span-5"
      >
        {spending.description}
      </div>
      <div className="w-fit text-end">${normalizeNumber(spending.amount)}</div>
      <div className="flex w-[72px] items-center justify-end gap-1">
        <Link
          href={`/edit?id=${spending.id}`}
          className="group rounded p-2 transition-colors active:bg-primary-400 sm:hover:bg-primary-400"
        >
          <EditIcon className="size-3 transition-colors group-active:text-background sm:size-4 sm:group-hover:text-background" />
        </Link>
        <button
          type="button"
          onClick={handleOnDelete}
          className="group rounded p-2 transition-colors active:bg-red-400 sm:hover:bg-red-400"
        >
          <DeleteIcon className="size-3 transition-colors group-active:text-background sm:size-4 sm:group-hover:text-background" />
        </button>
      </div>
    </div>
  );
};
