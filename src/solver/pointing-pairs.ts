import { type CellBlock } from "../game";
import type { SolverAction, SolverStrategy } from "./types";

export const pointingPairs: SolverStrategy = {
  id: "pointing-pairs",
  label: "Pointing Pairs",
  perform: ({ board }) => {
    return {
      actions: board.boxes.flatMap(findPointingPairs),
    };
  },
};

function findPointingPairs(box: CellBlock): ReadonlyArray<SolverAction> {
  const actions: Array<SolverAction> = [];

  for (let i = 1; i <= 9; i++) {
    const cells = box.cells.filter((c) => c.candidates.includes(i));

    if (cells.length >= 2) {
      for (const line of [cells[0].row, cells[0].column]) {
        const others = line.cells.filter(
          (c) => c.box !== box && c.candidates.includes(i)
        );

        if (
          others.length &&
          cells.every((c) => (line.type === "row" ? c.row : c.column) === line)
        ) {
          for (const cell of cells) {
            actions.push({
              type: "highlight-candidate",
              row: cell.row.nr,
              column: cell.column.nr,
              value: i,
              color: 1,
            });
          }

          for (const cell of others) {
            actions.push({
              type: "remove-candidate",
              row: cell.row.nr,
              column: cell.column.nr,
              value: i,
            });
          }
        }
      }
    }
  }

  return actions;
}
