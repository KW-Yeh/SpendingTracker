'use client';

import { OUTCOME_TYPE_MAP } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useEffect, useMemo, useState } from 'react';
import { CostTable } from './CostTable';

interface Props {
  totalNecessary: number;
  totalUnnecessary: number;
  necessaryList: {
    name: string;
    value: number;
    color: string;
  }[];
  unnecessaryList: {
    name: string;
    value: number;
    color: string;
  }[];
}

const defaultNecessaryList = OUTCOME_TYPE_MAP.map(({ label: category }) => ({
  name: category,
  value: 0,
}));

const NecessityCostTable = (props: Props) => {
  const [necessaryList, setNecessaryList] =
    useState<Array<{ name: string; value: number }>>(defaultNecessaryList);
  const [unnecessaryList, setUnnecessaryList] =
    useState<Array<{ name: string; value: number }>>(defaultNecessaryList);

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
    if (props.unnecessaryList.length > 0) {
      setUnnecessaryList((prevState) =>
        prevState.map((_d, index) => ({
          ..._d,
          value: props.unnecessaryList[index].value,
        })),
      );
    }
  }, [props.unnecessaryList]);

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
        title={`必要支出各項資訊 $${normalizeNumber(props.totalNecessary)}（${necessaryPercentage.toFixed(0)}%）`}
        total={props.totalNecessary}
        list={necessaryList}
        options={{
          headerStyle: 'bg-orange-500/30',
        }}
      />
      <CostTable
        title={`額外支出各項資訊 $${normalizeNumber(props.totalUnnecessary)}（${unnecessaryPercentage.toFixed(0)}%）`}
        total={props.totalUnnecessary}
        list={unnecessaryList}
        options={{
          headerStyle: 'bg-gray-500/30',
        }}
      />
    </>
  );
};

export default NecessityCostTable;
