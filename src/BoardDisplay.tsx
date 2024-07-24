import classes from "./BoardDisplay.module.css";
import type { Board } from "./game";
import type { SolverAction } from "./solver/types";

export default function BoardDisplay({
  board,
  actions,
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
                    className={[
                      classes[`candidate${c}`],
                      actions?.some(
                        (a) =>
                          a.type === "remove-candidate" &&
                          a.row === cell.row.nr &&
                          a.column === cell.column.nr &&
                          a.value === c
                      ) && classes.candidateRemoved,
                      actions?.some(
                        (a) =>
                          a.type === "set-value" &&
                          a.row === cell.row.nr &&
                          a.column === cell.column.nr &&
                          a.value === c
                      ) && classes.candidateSet,
                    ]
                      .filter(Boolean)
                      .join(" ")}
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
