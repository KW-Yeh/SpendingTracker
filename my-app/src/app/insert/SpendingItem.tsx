'use client';

import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { deleteItem } from '@/services/getRecords';
import { Necessity, SpendingType } from '@/utils/constants';
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
    return 'active:bg-gray-100 sm:hover:bg-gray-100';
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
      className={`relative flex h-12 items-center gap-2 rounded-lg transition-all sm:h-14 ${additionalStyle}`}
    >
      {deleting && (
        <span className="absolute top-0 left-1 -translate-y-1/2 rounded-full bg-red-300 px-2 text-xs font-bold">
          刪除中
        </span>
      )}
      {spending.necessity === Necessity.NotNeed ? (
        <span className="h-3/4 w-1 rounded-full bg-gray-400"></span>
      ) : (
        <span className="h-3/4 w-1 rounded-full bg-orange-400"></span>
      )}
      <div className="w-9 text-center text-xs sm:col-span-1">
        {formatDate(spending.date)}
      </div>
      <div
        title={spending.description}
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap sm:col-span-5"
      >
        {spending.description}
      </div>
      <div
        className={`w-fit text-end font-bold ${spending.type === SpendingType.Outcome ? 'text-red-500' : 'text-green-500'}`}
      >
        {spending.type === SpendingType.Outcome ? '-' : '+'}
        {normalizeNumber(spending.amount)}
      </div>
      <div className="flex w-15 items-center justify-end gap-1 sm:w-17">
        <Link
          href={`/edit?id=${spending.id}`}
          className="group active:bg-primary-200 sm:hover:bg-primary-200 rounded p-2 transition-colors"
        >
          <EditIcon className="group-active:text-primary-700 sm:group-hover:text-primary-700 size-3 transition-colors sm:size-4" />
        </Link>
        <button
          type="button"
          onClick={handleOnDelete}
          className="group rounded p-2 transition-colors active:bg-red-300 sm:hover:bg-red-300"
        >
          <DeleteIcon className="size-3 transition-colors group-active:text-red-700 sm:size-4 sm:group-hover:text-red-700" />
        </button>
      </div>
    </div>
  );
};
