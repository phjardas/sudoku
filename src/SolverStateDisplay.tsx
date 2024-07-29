import clsx from "clsx";
import type { SolverState, SolverStrategy } from "./solver/types";

export default function SolverStateDisplay({
  state,
  strategies,
  nextStep,
}: {
  state: SolverState;
  strategies: ReadonlyArray<SolverStrategy>;
  nextStep: () => void;
}) {
  switch (state.type) {
    case "solved":
      return (
        <div className="mb-4 bg-green-100 text-green-900 border border-green-900 rounded p-4">
          Solved!
        </div>
      );

    case "unsolvable":
      return (
        <div className="mb-4 bg-red-100 text-red-900 border border-red-900 rounded p-4">
          Sorry, I cannot solve this Sudoku with any of my strategies.
        </div>
      );

    default:
      return (
        <>
          <button
            onClick={nextStep}
            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Next step
          </button>
          <p>Turn {state.turn}</p>
          <ul>
            {strategies.map((strategy, i) => (
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
        </>
      );
  }
}
