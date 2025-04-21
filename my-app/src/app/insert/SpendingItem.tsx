'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { deleteItem } from '@/services/getRecords';
import { Necessity, SpendingType } from '@/utils/constants';
import { formatDate } from '@/utils/formatDate';
import { normalizeNumber } from '@/utils/normalizeNumber';
import Link from 'next/link';
import { startTransition, useCallback, useMemo, useState } from 'react';
import {
  MdOutlineBalance,
  MdOutlineCatchingPokemon,
  MdOutlineCategory,
  MdOutlineChecklistRtl,
  MdOutlineCheckroom,
  MdOutlineDirectionsCar,
  MdOutlineFastfood,
  MdOutlineHealing,
  MdOutlineHome,
  MdOutlineMonetizationOn,
  MdOutlineRedeem,
  MdOutlineSchool,
} from 'react-icons/md';

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

  const handleAction = useCallback(
    (action: string) => {
      if (action === 'delete') {
        handleOnDelete();
      }
    },
    [handleOnDelete],
  );

  return (
    <div
      className={`relative flex items-center gap-2 rounded-lg px-2 text-sm transition-all sm:h-14 sm:text-base ${additionalStyle}`}
    >
      {deleting && (
        <span className="absolute top-0 left-1 -translate-y-1/2 rounded-full bg-red-300 px-2 text-xs font-bold">
          刪除中
        </span>
      )}
      {spending.necessity === Necessity.NotNeed ? (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gray-400 p-1 text-white">
          {getCategoryIcon(spending.category)}
        </div>
      ) : (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-orange-400 p-1 text-white">
          {getCategoryIcon(spending.category)}
        </div>
      )}
      <div className="flex flex-1 items-center gap-2">
        <div className="flex flex-col text-start">
          <span className="text-sm">{formatDate(spending.date)}</span>
          <span className="text-xs text-gray-300">
            {new Date(spending.date).getFullYear()}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div
            title={spending.description}
            className="w-full overflow-hidden text-ellipsis whitespace-nowrap sm:col-span-5"
          >
            {spending.description}
          </div>
          <div className="flex w-full flex-wrap gap-1">
            {spending.tags &&
              spending.tags.map((tag, index) => (
                <span
                  key={`tag-${tag.name}-${index.toString()}`}
                  className="w-9 rounded-full border border-solid border-gray-300 text-center text-xs"
                  style={{
                    color: tag.color,
                    borderColor: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        className={`w-fit text-end font-bold ${spending.type === SpendingType.Outcome ? 'text-red-500' : 'text-green-500'}`}
      >
        {spending.type === SpendingType.Outcome ? '-' : '+'}
        {normalizeNumber(spending.amount)}
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

function getCategoryIcon(category: string) {
  switch (category) {
    case '🍔':
      return <MdOutlineFastfood />;
    case '👗':
      return <MdOutlineCheckroom />;
    case '🏠':
      return <MdOutlineHome />;
    case '🚗':
      return <MdOutlineDirectionsCar />;
    case '📚':
      return <MdOutlineSchool />;
    case '🎲':
      return <MdOutlineCatchingPokemon />;
    case '🧻':
      return <MdOutlineChecklistRtl />;
    case '💊':
      return <MdOutlineHealing />;
    case '📉':
      return <MdOutlineBalance />;
    case '📈':
      return <MdOutlineBalance />;
    case '💰':
      return <MdOutlineMonetizationOn />;
    case '🎁':
      return <MdOutlineRedeem />;
    case '✨':
      return <MdOutlineCategory />;
  }
}
