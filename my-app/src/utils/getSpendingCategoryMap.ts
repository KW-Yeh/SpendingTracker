import { INCOME_TYPE_MAP, OUTCOME_TYPE_MAP, SpendingType } from '@/utils/constants';

export const getSpendingCategoryMap = (type: string) => {
  return type === SpendingType.Income ? INCOME_TYPE_MAP : OUTCOME_TYPE_MAP;
};