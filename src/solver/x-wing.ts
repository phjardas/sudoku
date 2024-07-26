import { Board, possibleValues } from "../game";
import { arrayEquals } from "../utils";
import type { SolverAction, SolverStrategy } from "./types";

export const xwing: SolverStrategy = {
  id: "xwing",
  label: "X-Wing",
  perform: ({ board }) => {
    return {
      actions: possibleValues.flatMap((value) => findXWings(board, value)),
    };
  },
};

function findXWings(board: Board, value: number): ReadonlyArray<SolverAction> {
  const actions: Array<SolverAction> = [];

  const candidateRows = board.rows.filter(
    (row) =>
      row.cells.filter((cell) => cell.candidates.includes(value)).length === 2
  );

  for (let i = 0; i < candidateRows.length; i++) {
    const rowA = candidateRows[i];
    const rowAcolumns = rowA.cells
      .filter((cell) => cell.candidates.includes(value))
      .map((cell) => cell.column);

    for (let j = i + 1; j < candidateRows.length; j++) {
      const rowB = candidateRows[j];
      const rowBcolumns = rowB.cells
        .filter((cell) => cell.candidates.includes(value))
        .map((cell) => cell.column);

      if (arrayEquals(rowAcolumns, rowBcolumns)) {
        const removals: ReadonlyArray<SolverAction> = rowAcolumns.flatMap(
          (column) =>
            column.cells
              .filter(
                (c) =>
                  c.row !== rowA &&
                  c.row !== rowB &&
                  c.candidates.includes(value)
              )
              .map((cell) => ({
                type: "remove-candidate",
                row: cell.row.nr,
                column: cell.column.nr,
                value,
              }))
        );

        if (removals.length) {
          const highlights: ReadonlyArray<SolverAction> = [
            ...rowA.cells,
            ...rowB.cells,
          ]
            .filter((c) => c.candidates.includes(value))
            .map((cell) => ({
              type: "highlight-candidate",
              row: cell.row.nr,
              column: cell.column.nr,
              value,
              color: 1,
            }));

          actions.push(...removals, ...highlights);
        }
      }
    }
  }

  return actions;
}
