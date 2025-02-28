'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { CostTable } from './CostTable';
import { useEffect, useMemo, useState } from 'react';
import { INCOME_TYPE_MAP, OUTCOME_TYPE_MAP } from '@/utils/constants';

interface Props {
  totalNecessary: number;
  totalUnnecessary: number;
  necessaryList: {
    name: string;
    value: number;
    color: string;
  }[];
  unecessaryList: {
    name: string;
    value: number;
    color: string;
  }[];
}

const defaultNecessaryList = OUTCOME_TYPE_MAP.map(({ label: category }) => ({
  name: category,
  value: 0,
}));

const defaultUnnecessaryList = INCOME_TYPE_MAP.map(({ label: category }) => ({
  name: category,
  value: 0,
}));

const NecessityCostTable = (props: Props) => {
  const [necessaryList, setNecessaryList] =
    useState<Array<{ name: string; value: number }>>(defaultNecessaryList);
  const [unecessaryList, setUnnecessaryList] = useState<
    Array<{ name: string; value: number }>
  >(defaultUnnecessaryList);

  const total = useMemo(
    () => props.totalNecessary + props.totalUnnecessary,
    [props.totalNecessary, props.totalUnnecessary],
  );

  const unnecessaryPercentage = useMemo(
    () => (props.totalUnnecessary * 100) / (total || 100),
    [props.totalUnnecessary, total],
  );

  const necessaryPercentage = useMemo(
    () => (props.totalNecessary * 100) / (total || 100),
    [props.totalNecessary, total],
  );

  useEffect(() => {
    if (props.unecessaryList.length > 0) {
      setUnnecessaryList((prevState) =>
        prevState.map((_d, index) => ({
          ..._d,
          value: props.unecessaryList[index].value,
        })),
      );
    }
  }, [props.unecessaryList]);

  useEffect(() => {
    if (props.necessaryList.length > 0) {
      setNecessaryList((prevState) =>
        prevState.map((_d, index) => ({
          ..._d,
          value: props.necessaryList[index].value,
        })),
      );
    }
  }, [props.necessaryList]);
  return (
    <>
      <CostTable
        title={`必要支出各項資訊 ＄${normalizeNumber(props.totalNecessary)}（${necessaryPercentage.toFixed(0)}%）`}
        total={total}
        list={necessaryList}
        options={{
          headerStyle: 'bg-orange-500/30',
        }}
      />
      <CostTable
        title={`額外支出各項資訊 ＄${normalizeNumber(props.totalUnnecessary)}（${unnecessaryPercentage.toFixed(0)}%）`}
        total={total}
        list={unecessaryList}
        options={{
          headerStyle: 'bg-gray-500/30',
        }}
      />
    </>
  );
};

export default NecessityCostTable;
