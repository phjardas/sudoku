import type { CellBlock } from "../game";
import type { SolverAction, SolverStrategy } from "./types";

export const removeSeen: SolverStrategy = {
  id: "remove-seen",
  label: "Remove Seen",
  perform: ({ board }) => {
    return {
      actions: [...board.rows, ...board.columns, ...board.boxes].flatMap(
        removeBoxCandidates
      ),
    };
  },
};

function removeBoxCandidates(box: CellBlock): ReadonlyArray<SolverAction> {
  return box.values.flatMap((value) =>
    box.cells.flatMap((cell) =>
      cell.candidates.includes(value)
        ? [
            {
              type: "remove-candidate",
              row: cell.row.nr,
              column: cell.column.nr,
              value,
            },
          ]
        : []
    )
  );
}
