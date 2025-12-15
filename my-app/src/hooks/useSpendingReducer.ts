'use client';

import { Necessity, SpendingType } from '@/utils/constants';
import { useReducer } from 'react';

type Action =
  | {
      type: 'SET_AMOUNT';
      payload: string;
    }
  | {
      type: 'SET_CATEGORY';
      payload: string;
    }
  | {
      type: 'SET_DESC';
      payload: string;
    }
  | {
      type: 'SET_USER_TOKEN';
      payload: string;
    }
  | {
      type: 'SET_NECESSITY';
      payload: Necessity;
    }
  | {
      type: 'SET_DATE';
      payload: string;
    }
  | {
      type: 'SET_TYPE';
      payload: SpendingType;
    }
  | {
      type: 'RESET';
      payload?: Partial<SpendingRecord>;
    };

const INITIAL_STATE: SpendingRecord = {
  id: '',
  amount: '0',
  category: '🍔',
  date: new Date().toISOString(),
  description: '',
  necessity: Necessity.Need,
  'user-token': '',
  type: SpendingType.Outcome,
};

const reducer = (state: SpendingRecord, action: Action) => {
  switch (action.type) {
    case 'RESET':
      return { ...INITIAL_STATE, ...action.payload };
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_DESC':
      return { ...state, description: action.payload };
    case 'SET_USER_TOKEN':
      return { ...state, 'user-token': action.payload };
    case 'SET_NECESSITY':
      return { ...state, necessity: action.payload };
    case 'SET_DATE':
      return { ...state, date: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    default:
      return state;
  }
};

export const useSpendingReducer = () => {
  return useReducer(reducer, INITIAL_STATE);
};
