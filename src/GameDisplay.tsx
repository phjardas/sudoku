import clsx from "clsx";
import { useMemo, useState } from "react";
import BoardDisplay from "./BoardDisplay";
import type { Board } from "./game";
import { Solver } from "./solver";

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
          {solver.state.type === "unsolvable" && (
            <div className="mb-4 bg-red-100 text-red-900 border border-red-900 rounded p-4">
              Sorry, I cannot solve this Sudoku with any of my strategies.
            </div>
          )}
          {solver.state.type === "solved" && (
            <div className="mb-4 bg-green-100 text-green-900 border border-green-900 rounded p-4">
              Solved!
            </div>
          )}
          <button
            onClick={() => setState(solver.next())}
            className="bg-blue-100 text-blue-900 border border-blue-900 rounded py-1 px-2 mb-4"
          >
            Next step
          </button>
          <p>Turn {solver.state.turn}</p>
          <ul>
            {solver.strategies.map((strategy, i) => (
              <li
                key={strategy.id}
                className={clsx(
                  state.type === "strategy-preview" &&
                    state.strategyIndex === i &&
                    "bg-yellow-200 text-yellow-900",
                  state.type === "strategy-performed" &&
                    state.strategyIndex === i &&
                    "bg-green-200 text-green-900"
                )}
              >
                {strategy.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <pre className="mt-4 text-xs">
        {board.cells.map((c) => c.value ?? ".").join("")}
      </pre>
    </>
  );
}
