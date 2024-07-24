import type { Board } from "../game";
import { hiddenSingles } from "./hidden-singles";
import { nakedSingles } from "./naked-singles";
import { removeSeen } from "./remove-seen";
import {
  SolverState,
  SolverStrategy,
  StrategyPerformedState,
  StrategyPreviewState,
} from "./types";

export class Solver {
  readonly strategies: ReadonlyArray<SolverStrategy> = [
    removeSeen,
    nakedSingles,
    hiddenSingles,
  ];
  state: SolverState = { type: "initial", turn: 0 };

  constructor(readonly board: Board) {}

  next(): SolverState {
    switch (this.state.type) {
      case "initial":
        return (this.state = this.previewStrategy(0, this.state.turn + 1));
      case "strategy-performed":
        return (this.state = this.previewStrategy(
          this.state.strategyIndex === 0 ? 1 : 0,
          this.state.turn + 1
        ));
      case "strategy-preview":
        return (this.state = this.state.actions?.length
          ? this.applyStrategyResult(this.state)
          : this.previewStrategy(
              this.state.strategyIndex + 1,
              this.state.turn + 1
            ));
      default:
        throw new Error("Illegal state");
    }
  }

  private previewStrategy(
    strategyIndex: number,
    turn: number
  ): StrategyPreviewState {
    if (strategyIndex >= this.strategies.length) {
      throw new Error("Did not find any strategy to continue solving.");
    }

    const strategy = this.strategies[strategyIndex];
    const result = strategy.perform({ board: this.board });

    return { type: "strategy-preview", strategyIndex, turn, ...result };
  }

  private applyStrategyResult({
    strategyIndex,
    actions,
    turn,
  }: StrategyPreviewState): StrategyPerformedState {
    (actions ?? []).map((action) => {
      const cell = this.board.rows[action.row].cells[action.column];

      switch (action.type) {
        case "remove-candidate":
          cell.candidates = cell.candidates.filter((c) => c !== action.value);
          return;
        case "set-value":
          cell.value = action.value;
          cell.candidates = [];
          return;
      }
    });

    return { type: "strategy-performed", strategyIndex, turn: turn + 1 };
  }
}
