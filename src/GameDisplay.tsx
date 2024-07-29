import { useMemo, useState } from "react";
import BoardDisplay from "./BoardDisplay";
import type { Board } from "./game";
import { Solver } from "./solver";
import SolverStateDisplay from "./SolverStateDisplay";

export default function GameDisplay({ board }: { board: Board }) {
  const solver = useMemo(() => new Solver(board), [board]);
  const [state, setState] = useState(solver.state);

  return (
    <>
      <div className="flex gap-4 flex-row flex-wrap items-start">
        <BoardDisplay
          board={board}
          actions={
            state.type === "strategy-preview" ? state.actions : undefined
          }
          key={state.turn}
        />
        <div>
          <SolverStateDisplay
            state={state}
            strategies={solver.strategies}
            nextStep={() => setState(solver.next())}
          />
        </div>
      </div>
    </>
  );
}
