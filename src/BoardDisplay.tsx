import classes from "./BoardDisplay.module.css";
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
    <div className={classes.board}>
      {board.boxes.map((box, i) => (
        <div key={i} className={classes.box}>
          {box.cells.map((cell, k) => (
            <div
              key={k}
              className={`${classes.cell} ${cell.value ? classes.cellSolved : classes.cellUnsolved}`}
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
    `candidate${candidate}`,
    ...matchingActions.map((action) =>
      action.type === "highlight-candidate"
        ? `candidateHighlight${action.color}`
        : action.type === "remove-candidate"
          ? "candidateRemoved"
          : "candidateSet"
    ),
  ]
    .map((c) => classes[c])
    .join(" ");
}
