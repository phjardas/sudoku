import clsx from "clsx";
import type { Board, Cell } from "./game";
import type { SolverAction } from "./solver/types";

export default function BoardDisplay({
  board,
  actions = [],
}: {
  board: Board;
  actions?: ReadonlyArray<SolverAction>;
}) {
  return (
    <div className="grid grid-cols-3 border border-black">
      {board.boxes.map((box, i) => (
        <div key={i} className="inline-grid grid-cols-3 border border-black">
          {box.cells.map((cell, k) => (
            <div
              key={k}
              className={clsx(
                "border-[0.5px] border-black w-12 h-12 overflow-hidden",
                cell.value
                  ? "flex justify-center items-center text-2xl"
                  : "grid grid-cols-3 grid-rows-3 text-xs text-center items-center text-gray-400"
              )}
            >
              {cell.value ??
                cell.candidates.map((c) => (
                  <span
                    key={c}
                    className={getCandidateClasses(cell, c, actions)}
                  >
                    {c}
                  </span>
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getCandidateClasses(
  cell: Cell,
  candidate: number,
  actions: ReadonlyArray<SolverAction>
): string {
  const matchingActions = actions.filter(
    (a) =>
      (a.type === "highlight-candidate" ||
        a.type === "remove-candidate" ||
        a.type === "set-value") &&
      a.row === cell.row.nr &&
      a.column === cell.column.nr &&
      a.value === candidate
  );

  return [
    Math.floor((candidate - 1) / 3) === 0
      ? "row-start-1"
      : Math.floor((candidate - 1) / 3) === 1
        ? "row-start-2"
        : "row-start-3",
    candidate % 3 === 1
      ? "col-start-1"
      : candidate % 3 === 2
        ? "col-start-2"
        : "col-start-3",
    ...matchingActions.map((action) =>
      action.type === "highlight-candidate"
        ? action.color === 1
          ? "bg-cyan-200 text-cyan-900"
          : "bg-blue-200 text-blue-900"
        : action.type === "remove-candidate"
          ? "bg-red-200 text-red-900"
          : "bg-green-200 text-green-900"
    ),
  ].join(" ");
}
