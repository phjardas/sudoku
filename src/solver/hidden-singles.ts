import { CellBlock, possibleValues } from "../game";
import type { SolverAction, SolverStrategy } from "./types";

export const hiddenSingles: SolverStrategy = {
  id: "hidden-singles",
  label: "Hidden Singles",
  perform: ({ board }) => {
    return {
      actions: [...board.boxes, ...board.rows, ...board.columns].flatMap(
        findHiddenSingles
      ),
    };
  },
};

function findHiddenSingles(box: CellBlock): ReadonlyArray<SolverAction> {
  const values = box.values;

  return possibleValues
    .filter((candidate) => !values.includes(candidate))
    .flatMap((candidate) => {
      const cells = box.getCellsForCandidate(candidate);

      if (cells.length === 1) {
        const cell = cells[0];
        return {
          type: "set-value",
          row: cell.row.nr,
          column: cell.column.nr,
          value: candidate,
        };
      }

      return [];
    });
}
