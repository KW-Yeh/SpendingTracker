import {
  INCOME_TYPE_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import { CHART_COLORS } from '@/styles/colors';

// Create lookup Maps for O(1) category access
const INCOME_CATEGORY_MAP = new Map(
  INCOME_TYPE_MAP.map((item) => [item.value, item.label])
);
const OUTCOME_CATEGORY_MAP = new Map(
  OUTCOME_TYPE_MAP.map((item) => [item.value, item.label])
);

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
    CHART_COLORS.INCOME_PRIMARY,
    CHART_COLORS.INCOME_NECESSARY,
    CHART_COLORS.NEUTRAL,
  );
  const {
    results: outcomeList,
    necessaryList: outcomeNecessaryList,
    unnecessaryList: outcomeUnnecessaryList,
  } = getPieChartData(
    OUTCOME_TYPE_MAP,
    outcomeResult,
    CHART_COLORS.OUTCOME_PRIMARY,
    CHART_COLORS.OUTCOME_NECESSARY,
    CHART_COLORS.NEUTRAL,
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
    const amount = Number(record.amount);
    const isNecessary = record.necessity === Necessity.Need;

    if (record.type === SpendingType.Income) {
      const categoryLabel = INCOME_CATEGORY_MAP.get(record.category);
      if (categoryLabel) {
        totalIncome += amount;
        let temp = incomeResult.get(categoryLabel);

        if (!temp) {
          temp = getEmptyResult();
          incomeResult.set(categoryLabel, temp);
        }

        temp.total += amount;

        if (isNecessary) {
          necessaryIncome += amount;
          temp.necessary += amount;
          temp.necessaryList.push(amount);
        } else {
          unnecessaryIncome += amount;
          temp.unnecessary += amount;
          temp.unnecessaryList.push(amount);
        }
      }
    } else {
      const categoryLabel = OUTCOME_CATEGORY_MAP.get(record.category);
      if (categoryLabel) {
        totalOutcome += amount;
        let temp = outcomeResult.get(categoryLabel);

        if (!temp) {
          temp = getEmptyResult();
          outcomeResult.set(categoryLabel, temp);
        }

        temp.total += amount;

        if (isNecessary) {
          necessaryOutcome += amount;
          temp.necessary += amount;
          temp.necessaryList.push(amount);
        } else {
          unnecessaryOutcome += amount;
          temp.unnecessary += amount;
          temp.unnecessaryList.push(amount);
        }
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
