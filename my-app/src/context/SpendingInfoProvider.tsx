"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";

interface ContextValue {
  state: SpendingInfo;
  dispatcher: Dispatch<Actions>;
}

const INITIAL_STATE: SpendingInfo = {
  total: 0,
  income: 0,
  outcome: 0,
  incomes: [],
  outcomes: [],
};

const INITIAL_CONTEXT_VALUE: ContextValue = {
  state: INITIAL_STATE,
  dispatcher: () => null,
};

enum ActionType {
  addIncome = "ADD_INCOME",
  addOutcome = "ADD_OUTCOME",
  removeIncome = "REMOVE_INCOME",
  removeOutcome = "REMOVE_OUTCOME",
  updateIncome = "UPDATE_INCOME",
  updateOutcome = "UPDATE_OUTCOME",
}

type Actions =
  | { type: ActionType.addIncome; payload: SpendingRecord }
  | { type: ActionType.addOutcome; payload: SpendingRecord }
  | { type: ActionType.removeIncome; payload: string }
  | { type: ActionType.removeOutcome; payload: string }
  | { type: ActionType.updateIncome; payload: SpendingRecord }
  | { type: ActionType.updateOutcome; payload: SpendingRecord };

const reducer = (state: SpendingInfo, action: Actions): SpendingInfo => {
  switch (action.type) {
    case ActionType.addIncome:
      return {
        ...state,
        total: state.total + action.payload.amount,
        income: state.income + action.payload.amount,
        incomes: [...state.incomes, action.payload],
      };
    case ActionType.addOutcome:
      return {
        ...state,
        total: state.total + action.payload.amount,
        outcome: state.outcome + action.payload.amount,
        outcomes: [...state.outcomes, action.payload],
      };
    case ActionType.removeIncome:
      const income = state.incomes.find(
        (income) => income.id === action.payload,
      );
      if (!income) return state;
      return {
        ...state,
        total: state.total - income.amount,
        income: state.income - income.amount,
        incomes: state.incomes.filter((income) => income.id !== action.payload),
      };
    case ActionType.removeOutcome:
      const outcome = state.outcomes.find(
        (outcome) => outcome.id === action.payload,
      );
      if (!outcome) return state;
      return {
        ...state,
        total: state.total - outcome.amount,
        outcome: state.outcome - outcome.amount,
        outcomes: state.outcomes.filter(
          (outcome) => outcome.id !== action.payload,
        ),
      };
    case ActionType.updateIncome:
      return {
        ...state,
        total:
          state.total +
          state.incomes.find((income) => income.id === action.payload.id)!
            .amount -
          action.payload.amount,
        income:
          state.income +
          state.incomes.find((income) => income.id === action.payload.id)!
            .amount -
          action.payload.amount,
        incomes: state.incomes.map((income) =>
          income.id === action.payload.id ? action.payload : income,
        ),
      };
    case ActionType.updateOutcome:
      return {
        ...state,
        total:
          state.total +
          state.outcomes.find((outcome) => outcome.id === action.payload.id)!
            .amount -
          action.payload.amount,
        outcome:
          state.outcome +
          state.outcomes.find((outcome) => outcome.id === action.payload.id)!
            .amount -
          action.payload.amount,
        outcomes: state.outcomes.map((outcome) =>
          outcome.id === action.payload.id ? action.payload : outcome,
        ),
      };
  }
};

export const SpendingInfoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatcher] = useReducer(reducer, INITIAL_STATE);

  const contextValue = useMemo(() => ({ state, dispatcher }), [state]);

  return <Ctx.Provider value={contextValue}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INITIAL_CONTEXT_VALUE);
export const useSpendingInfo = () => useContext(Ctx);
