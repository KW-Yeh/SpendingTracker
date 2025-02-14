'use client';

import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { deleteItem } from '@/services/dbHandler';
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
      return 'border-transparent shadow-[0_0_0_2px_#fca5a5]';
    }
    return 'active:bg-gray-200 sm:hover:bg-gray-200';
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
      className={`relative flex h-11 items-center gap-2 rounded border-l-4 border-solid px-2 transition-all odd:bg-gray-100 sm:h-14 ${spending.necessity === Necessity.NotNeed ? 'border-gray-300' : 'border-orange-300'} ${additionalStyle}`}
    >
      {deleting && (
        <span className="absolute left-1 top-0 -translate-y-1/2 rounded-full bg-red-300 px-2 text-xs font-bold">
          刪除中
        </span>
      )}
      <div className="w-8 text-center text-xs sm:col-span-1 sm:text-sm">
        {formatDate(spending.date)}
      </div>
      <div
        title={spending.description}
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap sm:col-span-5"
      >
        {spending.description}
      </div>
      <div className="w-fit text-end">${normalizeNumber(spending.amount)}</div>
      <div className="flex w-16 items-center justify-end">
        <Link
          href={`/edit/${spending.id}`}
          className="group rounded p-2 transition-colors active:bg-primary-500 sm:hover:bg-primary-500"
        >
          <EditIcon className="size-3 transition-colors group-active:text-background sm:size-4 sm:group-hover:text-background" />
        </Link>
        <button
          type="button"
          onClick={handleOnDelete}
          className="group rounded p-2 transition-colors active:bg-red-500 sm:hover:bg-red-500"
        >
          <DeleteIcon className="size-3 transition-colors group-active:text-background sm:size-4 sm:group-hover:text-background" />
        </button>
      </div>
    </div>
  );
};
