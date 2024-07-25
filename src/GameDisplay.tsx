import { useMemo, useState } from "react";
import BoardDisplay from "./BoardDisplay";
import type { Board } from "./game";
import { Solver } from "./solver";

export default function GameDisplay({ board }: { board: Board }) {
  const solver = useMemo(() => new Solver(board), [board]);
  const [state, setState] = useState(solver.state);

  return (
    <>
      <div>
        <BoardDisplay
          board={board}
          actions={
            state.type === "strategy-preview" ? state.actions : undefined
          }
          key={state.turn}
        />
      </div>
      <p>Code: {board.cells.map((c) => c.value ?? "0").join("")}</p>
      {solver.state.type === "unsolvable" && (
        <div>Sorry, I cannot solve this Sudoku with any of my strategies.</div>
      )}
      {solver.state.type === "solved" && <div>Solved!</div>}
      <button onClick={() => setState(solver.next())}>next</button>
      <ul>
        {solver.strategies.map((strategy, i) => (
          <li key={strategy.id}>
            {state.type === "strategy-preview" && state.strategyIndex === i
              ? "Preview: "
              : state.type === "strategy-performed" && state.strategyIndex === i
                ? "Performed: "
                : ""}
            {strategy.label}
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
}
