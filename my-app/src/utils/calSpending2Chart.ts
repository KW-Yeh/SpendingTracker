import {
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';

export const calSpending2Chart = (data: SpendingRecord[]): PieChartData => {
  const incomeResult: Record<
    string,
    {
      necessary: number;
      unnecessary: number;
      total: number;
    }
  > = {};
  let totalIncome = 0;
  let necessaryIncome = 0;
  let unnecessaryIncome = 0;
  const outcomeResult: Record<
    string,
    {
      necessary: number;
      unnecessary: number;
      total: number;
    }
  > = {};
  let totalOutcome = 0;
  let necessaryOutcome = 0;
  let unnecessaryOutcome = 0;
  data.forEach((record) => {
    if (record.type === SpendingType.Income) {
      const category = INCOME_TYPE_MAP.find((d) => d.value === record.category);
      if (category) {
        totalIncome += record.amount;
        if (!incomeResult[category.label]) {
          incomeResult[category.label] = {
            necessary: 0,
            unnecessary: 0,
            total: 0,
          };
        }
        if (record.necessity === Necessity.Need) {
          necessaryIncome += record.amount;
          incomeResult[category.label].necessary += record.amount;
        } else {
          unnecessaryIncome += record.amount;
          incomeResult[category.label].unnecessary += record.amount;
        }
        incomeResult[category.label].total += record.amount;
      }
    } else {
      const category = OUTCOME_TYPE_MAP.find(
        (d) => d.value === record.category,
      );
      if (category) {
        totalOutcome += record.amount;
        if (!outcomeResult[category.label]) {
          outcomeResult[category.label] = {
            necessary: 0,
            unnecessary: 0,
            total: 0,
          };
        }
        if (record.necessity === Necessity.Need) {
          necessaryOutcome += record.amount;
          outcomeResult[category.label].necessary += record.amount;
        } else {
          unnecessaryOutcome += record.amount;
          outcomeResult[category.label].unnecessary += record.amount;
        }
        outcomeResult[category.label].total += record.amount;
      }
    }
  });
  const incomeList: Array<{
    id: string;
    name: string;
    value: number;
    necessary: number;
    unnecessary: number;
    color: string;
  }> = [];
  const outcomeList: Array<{
    id: string;
    name: string;
    value: number;
    necessary: number;
    unnecessary: number;
    color: string;
  }> = [];
  Object.keys(incomeResult).forEach((category) => {
    incomeList.push({
      id: category,
      name: category,
      value: incomeResult[category].total,
      necessary: incomeResult[category].necessary,
      unnecessary: incomeResult[category].unnecessary,
      color: '#82ca9d',
    });
  });
  Object.keys(outcomeResult).forEach((category) => {
    outcomeList.push({
      id: category,
      name: category,
      value: outcomeResult[category].total,
      necessary: outcomeResult[category].necessary,
      unnecessary: outcomeResult[category].unnecessary,
      color: '#faa5a5',
    });
  });
  return {
    income: {
      total: totalIncome,
      necessary: necessaryIncome,
      unnecessary: unnecessaryIncome,
      list: incomeList,
    },
    outcome: {
      total: totalOutcome,
      necessary: necessaryOutcome,
      unnecessary: unnecessaryOutcome,
      list: outcomeList,
    },
  };
};
