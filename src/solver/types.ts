import type { Board } from "../game";

export type SolverContext = {
  board: Board;
};

export type RemoveCandidate = {
  type: "remove-candidate";
  row: number;
  column: number;
  value: number;
};

export type SetValue = {
  type: "set-value";
  row: number;
  column: number;
  value: number;
};

export type SolverAction = RemoveCandidate | SetValue;

export type SolverStrategyResult = {
  actions?: ReadonlyArray<SolverAction>;
  notes?: ReadonlyArray<string>;
};

export type SolverStrategy = {
  id: string;
  label: string;
  perform: (context: SolverContext) => SolverStrategyResult;
};

export type InitialSolverState = { type: "initial"; turn: 0 };

export type StrategyPreviewState = {
  type: "strategy-preview";
  strategyIndex: number;
  turn: number;
  actions?: ReadonlyArray<SolverAction>;
  notes?: ReadonlyArray<string>;
};

export type StrategyPerformedState = {
  type: "strategy-performed";
  strategyIndex: number;
  turn: number;
};

export type SolverState =
  | InitialSolverState
  | StrategyPreviewState
  | StrategyPerformedState;
