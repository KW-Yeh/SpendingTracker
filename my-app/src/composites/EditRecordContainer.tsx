'use client';

import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { Necessity, SpendingType } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { v7 as uuid } from 'uuid';
import { EditExpenseModal } from './EditExpenseModal';

const EditRecordContainer = ({ recordId }: { recordId?: string | null }) => {
  const router = useRouter();
  const [matchedData, setMatchedData] = useState<SpendingRecord>();
  const { data } = useGetSpendingCtx();
  const [isMatched, setIsMatched] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOnClose = useCallback(() => {
    setMatchedData(undefined);
    setIsMatched(false);
    setOpen(false);
    router.back();
  }, [router]);

  useEffect(() => {
    if (!open) {
      let _data: SpendingRecord = {
        id: uuid(),
        'user-token': '',
        category: '🍔',
        necessity: Necessity.Need,
        type: SpendingType.Outcome,
        amount: 0,
        description: '',
        date: new Date().toUTCString(),
      };
      if (!recordId) {
        setMatchedData(_data);
      } else if (data.length > 0) {
        const matched = data.find((record) => record.id === recordId);
        setIsMatched(matched !== undefined);
        if (matched) {
          _data = {
            ..._data,
            ...matched,
          };
        }
        setMatchedData(_data);
      }
      setOpen(true);
    }
  }, [recordId, data, open]);

  if (!open || !matchedData) return null;

  return (
    <EditExpenseModal
      data={matchedData}
      isNewData={!isMatched}
      onClose={handleOnClose}
    />
  );
};

export default EditRecordContainer;
