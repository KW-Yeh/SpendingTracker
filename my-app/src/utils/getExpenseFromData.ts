import { SpendingType } from '@/utils/constants';

export const getExpenseFromData = (data: SpendingRecord[]) => {
  let _totalIncome = 0;
  let _totalOutcome = 0;
  data.forEach((item) => {
    if (item.type === SpendingType.Income) {
      _totalIncome += item.amount;
    } else {
      _totalOutcome += item.amount;
    }
  });
  return {
    totalIncome: _totalIncome,
    totalOutcome: _totalOutcome,
  };
};
