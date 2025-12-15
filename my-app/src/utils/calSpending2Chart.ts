import {
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';

export const calSpending2Chart = (data: SpendingRecord[]): PieChartData => {
  const {
    incomeResult,
    totalIncome,
    necessaryIncome,
    unnecessaryIncome,
    outcomeResult,
    totalOutcome,
    necessaryOutcome,
    unnecessaryOutcome,
  } = parseData(data);

  const {
    results: incomeList,
    necessaryList: incomeNecessaryList,
    unnecessaryList: incomeUnnecessaryList,
  } = getPieChartData(
    INCOME_TYPE_MAP,
    incomeResult,
    '#82ca9d',
    '#fdba74',
    '#d1d5db',
  );
  const {
    results: outcomeList,
    necessaryList: outcomeNecessaryList,
    unnecessaryList: outcomeUnnecessaryList,
  } = getPieChartData(
    OUTCOME_TYPE_MAP,
    outcomeResult,
    '#faa5a5',
    '#fdba74',
    '#d1d5db',
  );

  return {
    income: {
      total: totalIncome,
      necessary: necessaryIncome,
      unnecessary: unnecessaryIncome,
      necessaryList: incomeNecessaryList,
      unnecessaryList: incomeUnnecessaryList,
      list: incomeList,
    },
    outcome: {
      total: totalOutcome,
      necessary: necessaryOutcome,
      unnecessary: unnecessaryOutcome,
      necessaryList: outcomeNecessaryList,
      unnecessaryList: outcomeUnnecessaryList,
      list: outcomeList,
    },
  };
};

const getPieChartData = (
  types: {
    value: string;
    label: string;
  }[],
  data: Map<string, ExpenseResult>,
  resultColor: string,
  necessaryColor: string,
  unnecessaryColor: string,
) => {
  const results: Array<PieChartDataItem> = [];
  const necessaryList: PieChartDataBase[] = [];
  const unnecessaryList: PieChartDataBase[] = [];

  types.forEach(({ label }) => {
    const expenseData = data.get(label) ?? getEmptyResult();
    results.push({
      id: label,
      name: label,
      value: expenseData.total,
      necessary: expenseData.necessary,
      unnecessary: expenseData.unnecessary,
      color: resultColor,
    });
    necessaryList.push({
      name: label,
      value: expenseData.necessaryList.reduce((acc, d) => acc + d, 0),
      color: necessaryColor,
    });
    unnecessaryList.push({
      name: label,
      value: expenseData.unnecessaryList.reduce((acc, d) => acc + d, 0),
      color: unnecessaryColor,
    });
  });
  return { results, necessaryList, unnecessaryList };
};

type ExpenseResult = {
  necessary: number;
  unnecessary: number;
  necessaryList: number[];
  unnecessaryList: number[];
  total: number;
};

const getEmptyResult = (): ExpenseResult => {
  return {
    necessary: 0,
    unnecessary: 0,
    necessaryList: [],
    unnecessaryList: [],
    total: 0,
  };
};

const parseData = (data: SpendingRecord[]) => {
  const incomeResult: Map<string, ExpenseResult> = new Map();
  let totalIncome = 0;
  let necessaryIncome = 0;
  let unnecessaryIncome = 0;
  const outcomeResult: Map<string, ExpenseResult> = new Map();
  let totalOutcome = 0;
  let necessaryOutcome = 0;
  let unnecessaryOutcome = 0;
  data.forEach((record) => {
    if (record.type === SpendingType.Income) {
      const category = INCOME_TYPE_MAP.find((d) => d.value === record.category);
      if (category) {
        totalIncome += Number(record.amount);
        let temp = incomeResult.get(category.label) ?? getEmptyResult();
        if (record.necessity === Necessity.Need) {
          necessaryIncome += Number(record.amount);
          temp = {
            ...temp,
            necessary: temp.necessary + Number(record.amount),
            necessaryList: [...temp.necessaryList, Number(record.amount)],
          };
        } else {
          unnecessaryIncome += Number(record.amount);
          temp = {
            ...temp,
            unnecessary: temp.unnecessary + Number(record.amount),
            unnecessaryList: [...temp.unnecessaryList, Number(record.amount)],
          };
        }
        incomeResult.set(category.label, {
          ...temp,
          total: temp.total + Number(record.amount),
        });
      }
    } else {
      const category = OUTCOME_TYPE_MAP.find(
        (d) => d.value === record.category,
      );
      if (category) {
        totalOutcome += Number(record.amount);
        let temp = outcomeResult.get(category.label) ?? getEmptyResult();
        if (record.necessity === Necessity.Need) {
          necessaryOutcome += Number(record.amount);
          temp = {
            ...temp,
            necessary: temp.necessary + Number(record.amount),
            necessaryList: [...temp.necessaryList, Number(record.amount)],
          };
        } else {
          unnecessaryOutcome += Number(record.amount);
          temp = {
            ...temp,
            unnecessary: temp.unnecessary + Number(record.amount),
            unnecessaryList: [...temp.unnecessaryList, Number(record.amount)],
          };
        }
        outcomeResult.set(category.label, {
          ...temp,
          total: temp.total + Number(record.amount),
        });
      }
    }
  });
  return {
    incomeResult,
    totalIncome,
    necessaryIncome,
    unnecessaryIncome,
    outcomeResult,
    totalOutcome,
    necessaryOutcome,
    unnecessaryOutcome,
  };
};
