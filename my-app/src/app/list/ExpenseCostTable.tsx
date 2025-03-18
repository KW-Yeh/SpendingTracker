'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { CostTable } from './CostTable';
import { useEffect, useMemo, useState } from 'react';
import { INCOME_TYPE_MAP, OUTCOME_TYPE_MAP } from '@/utils/constants';

interface Props {
  totalIncome: number;
  totalOutcome: number;
  incomeList: PieChartDataItem[];
  outcomeList: PieChartDataItem[];
}

const defaultOutcomeList = OUTCOME_TYPE_MAP.map(({ label: category }) => ({
  name: category,
  value: 0,
}));

const defaultIncomeList = INCOME_TYPE_MAP.map(({ label: category }) => ({
  name: category,
  value: 0,
}));

const ExpenseCostTable = (props: Props) => {
  const [outcomeList, setOutcomeList] =
    useState<Array<{ name: string; value: number }>>(defaultOutcomeList);
  const [incomeList, setIncomeList] =
    useState<Array<{ name: string; value: number }>>(defaultIncomeList);

  const total = useMemo(
    () => props.totalIncome + props.totalOutcome,
    [props.totalIncome, props.totalOutcome],
  );

  const outcomePercentage = useMemo(
    () => (props.totalOutcome * 100) / (total || 100),
    [props.totalOutcome, total],
  );

  const incomePercentage = useMemo(
    () => (props.totalIncome * 100) / (total || 100),
    [props.totalIncome, total],
  );

  useEffect(() => {
    if (props.outcomeList.length > 0) {
      setOutcomeList((prevState) =>
        prevState.map((_d, index) => ({
          ..._d,
          value: props.outcomeList[index].value,
        })),
      );
    }
  }, [props.outcomeList]);

  useEffect(() => {
    if (props.incomeList.length > 0) {
      setIncomeList((prevState) =>
        prevState.map((_d, index) => ({
          ..._d,
          value: props.incomeList[index].value,
        })),
      );
    }
  }, [props.incomeList]);

  return (
    <>
      <CostTable
        title={`支出各項資訊 $${normalizeNumber(props.totalOutcome)}（${outcomePercentage.toFixed(0)}%）`}
        total={total}
        list={outcomeList}
        options={{
          headerStyle: 'bg-red-500/30',
        }}
      />
      <CostTable
        title={`收入各項資訊 $${normalizeNumber(props.totalIncome)}（${incomePercentage.toFixed(0)}%）`}
        total={total}
        list={incomeList}
        options={{
          headerStyle: 'bg-green-500/30',
        }}
      />
    </>
  );
};

export default ExpenseCostTable;
