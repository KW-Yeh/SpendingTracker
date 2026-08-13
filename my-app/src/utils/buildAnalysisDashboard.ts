import {
  CATEGORY_WORDING_MAP,
  Necessity,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';

const OUTCOME_CATEGORIES = new Set(OUTCOME_TYPE_MAP.map(({ value }) => value));

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const getMonthLabel = (date: Date) =>
  `${String(date.getMonth() + 1).padStart(2, '0')}月`;

const getMonthDate = (anchor: Date, offset: number) =>
  new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1);

const getBudgetForMonth = (budget: Budget | null, month: number) => {
  if (!budget?.monthly_items) return 0;

  return budget.monthly_items.reduce((sum, item) => {
    if (!OUTCOME_CATEGORIES.has(item.category)) return sum;
    return sum + Number(item.months?.[String(month)] ?? 0);
  }, 0);
};

export const buildAnalysisDashboard = (
  records: SpendingRecord[],
  budget: Budget | null,
  anchor: Date,
): AnalysisDashboardData => {
  const monthDates = Array.from({ length: 13 }, (_, index) =>
    getMonthDate(anchor, index - 12),
  );

  const buckets = new Map(
    monthDates.map((date) => [
      getMonthKey(date),
      { income: 0, outcome: 0, necessary: 0, unnecessary: 0 },
    ]),
  );

  records.forEach((record) => {
    const bucket = buckets.get(getMonthKey(new Date(record.date)));
    if (!bucket) return;

    const amount = Number(record.amount);
    if (!Number.isFinite(amount)) return;

    if (record.type === SpendingType.Income) {
      bucket.income += amount;
      return;
    }

    bucket.outcome += amount;
    if (record.necessity === Necessity.Need) {
      bucket.necessary += amount;
    } else {
      bucket.unnecessary += amount;
    }
  });

  const allMonths = monthDates.map((date, index) => {
    const bucket = buckets.get(getMonthKey(date))!;
    const movingWindow = monthDates
      .slice(Math.max(0, index - 2), index + 1)
      .map((windowDate) => buckets.get(getMonthKey(windowDate))!.outcome);
    const movingAverage =
      movingWindow.reduce((sum, value) => sum + value, 0) / movingWindow.length;

    return {
      key: getMonthKey(date),
      label: getMonthLabel(date),
      ...bucket,
      necessaryPercent:
        bucket.outcome > 0 ? (bucket.necessary / bucket.outcome) * 100 : 0,
      unnecessaryPercent:
        bucket.outcome > 0 ? (bucket.unnecessary / bucket.outcome) * 100 : 0,
      movingAverage: Math.round(movingAverage),
      budget: getBudgetForMonth(budget, date.getMonth() + 1),
    };
  });

  const selectedMonth = allMonths.at(-1)!;
  const previousMonth = allMonths.at(-2)!;
  const selectedKey = selectedMonth.key;
  const previousKey = previousMonth.key;
  const categoryTotals = new Map<
    string,
    { current: number; previous: number }
  >();

  records.forEach((record) => {
    if (record.type !== SpendingType.Outcome) return;
    const key = getMonthKey(new Date(record.date));
    if (key !== selectedKey && key !== previousKey) return;

    const totals = categoryTotals.get(record.category) ?? {
      current: 0,
      previous: 0,
    };
    if (key === selectedKey) totals.current += Number(record.amount);
    if (key === previousKey) totals.previous += Number(record.amount);
    categoryTotals.set(record.category, totals);
  });

  const categoryChanges = Array.from(categoryTotals.entries())
    .map(([category, totals]) => ({
      category,
      label: CATEGORY_WORDING_MAP[category] ?? category,
      ...totals,
      change: totals.current - totals.previous,
    }))
    .filter((item) => item.current > 0 || item.previous > 0)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 5);

  const budgetByCategory = new Map<string, number>();
  budget?.monthly_items.forEach((item) => {
    if (!OUTCOME_CATEGORIES.has(item.category)) return;
    const amount = Number(item.months?.[String(anchor.getMonth() + 1)] ?? 0);
    budgetByCategory.set(
      item.category,
      (budgetByCategory.get(item.category) ?? 0) + amount,
    );
  });

  const selectedSpendingByCategory = new Map<string, number>();
  records.forEach((record) => {
    if (
      record.type !== SpendingType.Outcome ||
      getMonthKey(new Date(record.date)) !== selectedKey
    ) {
      return;
    }
    selectedSpendingByCategory.set(
      record.category,
      (selectedSpendingByCategory.get(record.category) ?? 0) +
        Number(record.amount),
    );
  });

  const budgetCategories = new Set([
    ...budgetByCategory.keys(),
    ...selectedSpendingByCategory.keys(),
  ]);
  const budgetProgress = Array.from(budgetCategories)
    .map((category) => {
      const budgeted = budgetByCategory.get(category) ?? 0;
      const spent = selectedSpendingByCategory.get(category) ?? 0;
      return {
        category,
        label: CATEGORY_WORDING_MAP[category] ?? category,
        budgeted,
        spent,
        remaining: budgeted - spent,
        usagePercent:
          budgeted > 0 ? (spent / budgeted) * 100 : spent > 0 ? 100 : 0,
        isOver: spent > budgeted,
      };
    })
    .filter((item) => item.budgeted > 0 || item.spent > 0)
    .sort((a, b) => {
      if (a.isOver !== b.isOver) return a.isOver ? -1 : 1;
      return b.usagePercent - a.usagePercent;
    });

  const previousDelta = selectedMonth.outcome - previousMonth.outcome;

  return {
    selectedMonthLabel: `${anchor.getFullYear()} 年 ${anchor.getMonth() + 1} 月`,
    previousMonthLabel: `${previousMonth.key.slice(0, 4)} 年 ${Number(previousMonth.key.slice(5))} 月`,
    months: allMonths.slice(1),
    necessityMonths: allMonths.slice(-6),
    categoryChanges,
    budgetProgress,
    summary: {
      outcome: selectedMonth.outcome,
      income: selectedMonth.income,
      net: selectedMonth.income - selectedMonth.outcome,
      previousDelta,
      previousChangePercent:
        previousMonth.outcome > 0
          ? (previousDelta / previousMonth.outcome) * 100
          : null,
      budgeted: selectedMonth.budget,
      budgetUsagePercent:
        selectedMonth.budget > 0
          ? (selectedMonth.outcome / selectedMonth.budget) * 100
          : null,
    },
  };
};
