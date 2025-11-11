'use client';

import { ActionMenu } from '@/components/ActionMenu';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { deleteItem } from '@/services/getRecords';
import {
  CATEGORY_WORDING_MAP,
  Necessity,
  SpendingType,
} from '@/utils/constants';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { getSpendingCategoryMap } from '@/utils/getSpendingCategoryMap';
import { normalizeNumber } from '@/utils/normalizeNumber';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useCallback, useMemo, useState } from 'react';

interface Props {
  spending: SpendingRecord;
  refreshData: (groupId?: string) => void;
  userInfo?: MemberType;
  canEdit: boolean;
}

export const CollaborateRecordItem = (props: Props) => {
  const { spending, refreshData, userInfo, canEdit } = props;
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
    if (!canEdit) {
      alert('你沒有權限刪除其他人的記錄');
      return;
    }
    if (!confirm('確定要刪除這筆資料嗎?')) return;
    setDeleting(true);
    deleteItem(spending.id).then(() => {
      startTransition(() => {
        setDeleting(false);
        if (spending.groupId) {
          refreshData(spending.groupId);
        } else {
          refreshData();
        }
      });
    });
  }, [canEdit, refreshData, spending.id, spending.groupId]);

  const handleAction = useCallback(
    (action: string) => {
      if (!canEdit) {
        alert('你沒有權限編輯其他人的記錄');
        return;
      }
      if (action === 'delete') {
        handleOnDelete();
      } else if (action === 'edit') {
        router.push(`/edit?id=${spending.id}`);
      }
    },
    [canEdit, handleOnDelete, router, spending.id],
  );

  return (
    <div
      className={`relative flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm transition-all sm:text-base md:p-3 ${additionalStyle}`}
    >
      {deleting && (
        <span className="absolute top-0 left-1 -translate-y-1/2 rounded-full bg-red-300 px-2 py-0.5 text-xs font-bold text-white">
          刪除中
        </span>
      )}
      
      {/* 使用者頭像 */}
      {userInfo && (
        <Image
          src={userInfo.image}
          alt={userInfo.name}
          title={userInfo.name}
          width={24}
          height={24}
          className="size-6 rounded-full border border-gray-300"
        />
      )}
      
      {/* 分類圖示 */}
      {category && (
        <span
          title={CATEGORY_WORDING_MAP[category.value]}
          className="flex size-6 items-center justify-center rounded-md"
        >
          {getCategoryIcon(
            category.value,
            `size-5 ${spending.necessity === Necessity.Need ? 'text-primary-500' : 'text-gray-500'}`,
          )}
        </span>
      )}
      
      {/* 描述 */}
      <div
        title={spending.description}
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium"
      >
        {spending.description}
      </div>
      
      {/* 金額 */}
      <div
        className={`w-fit text-end font-bold ${spending.type === SpendingType.Outcome ? 'text-red-500' : 'text-green-500'}`}
      >
        ${normalizeNumber(spending.amount)}
      </div>
      
      {/* 操作選單 - 只有當 canEdit 為 true 時才顯示 */}
      {canEdit ? (
        <ActionMenu
          onClick={handleAction}
          options={[
            {
              value: 'edit',
              label: (
                <Link
                  href={`/edit?id=${spending.id}`}
                  className="text-text group-hover:text-primary-500 group-active:text-primary-500 flex items-center gap-3 rounded px-2 py-1 transition-colors"
                >
                  <EditIcon className="size-3.5 transition-colors sm:size-4" />
                  <span>編輯</span>
                </Link>
              ),
            },
            {
              value: 'delete',
              label: (
                <span className="group text-text flex items-center gap-3 rounded px-2 py-1 transition-colors group-hover:text-red-500 group-active:text-red-500">
                  <DeleteIcon className="size-3.5 transition-colors sm:size-4" />
                  <span>刪除</span>
                </span>
              ),
            },
          ]}
        />
      ) : (
        <div className="w-6"></div>
      )}
    </div>
  );
};
