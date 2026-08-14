'use client';

import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { Necessity, SpendingType } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { v7 as uuid } from 'uuid';
import { EditExpenseModal } from './EditExpenseModal';

const createEmptyRecord = (): SpendingRecord => ({
  id: uuid(),
  'user-token': '',
  category: '🍔',
  necessity: Necessity.Need,
  type: SpendingType.Outcome,
  amount: '0',
  description: '',
  date: new Date().toISOString(),
});

const EditRecordContainer = ({ recordId }: { recordId?: string | null }) => {
  const router = useRouter();
  const [emptyRecord] = useState(createEmptyRecord);
  const { data } = useGetSpendingCtx();

  const handleOnClose = useCallback(() => {
    router.back();
  }, [router]);

  const matchedRecord = recordId
    ? data.find((record) => record.id === recordId)
    : undefined;

  if (recordId && data.length === 0) return null;

  const modalData = matchedRecord
    ? { ...emptyRecord, ...matchedRecord }
    : emptyRecord;

  return (
    <EditExpenseModal
      data={modalData}
      isNewData={!matchedRecord}
      onClose={handleOnClose}
    />
  );
};

export default EditRecordContainer;
