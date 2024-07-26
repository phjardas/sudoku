import type { Board } from "../game";
import { boxLineReduction } from "./box-line-reduction";
import { hiddenPairs } from "./hidden-pairs";
import { hiddenSingles } from "./hidden-singles";
import { hiddenTriples } from "./hidden-triples";
import { nakedPairs } from "./naked-pairs";
import { nakedSingles } from "./naked-singles";
import { nakedTriples } from "./naked-triples";
import { pointingPairs } from "./pointing-pairs";
import { removeSeen } from "./remove-seen";
import { SolverState, SolverStrategy, StrategyPreviewState } from "./types";
import { xwing } from "./x-wing";

export class Solver {
  readonly strategies: ReadonlyArray<SolverStrategy> = [
    removeSeen,
    nakedSingles,
    hiddenSingles,
    nakedPairs,
    nakedTriples,
    hiddenPairs,
    hiddenTriples,
    pointingPairs,
    boxLineReduction,
    xwing,
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

  private previewStrategy(strategyIndex: number, turn: number): SolverState {
    if (strategyIndex >= this.strategies.length) {
      return { type: "unsolvable", turn };
    }

    const strategy = this.strategies[strategyIndex];
    const result = strategy.perform({ board: this.board });

    if (!result.actions?.length) {
      return this.previewStrategy(strategyIndex + 1, turn);
    }

    return { type: "strategy-preview", strategyIndex, turn, ...result };
  }

  private applyStrategyResult({
    strategyIndex,
    actions,
    turn,
  }: StrategyPreviewState): SolverState {
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

    return this.board.cells.some((c) => !c.value)
      ? { type: "strategy-performed", strategyIndex, turn: turn + 1 }
      : { type: "solved", turn: turn + 1 };
  }
}
