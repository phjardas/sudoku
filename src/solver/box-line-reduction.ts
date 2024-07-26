import { type CellBlock } from "../game";
import type { SolverAction, SolverStrategy } from "./types";

export const boxLineReduction: SolverStrategy = {
  id: "box-line-reduction",
  label: "Box-Line Reduction",
  perform: ({ board }) => {
    return {
      actions: [...board.rows, ...board.columns].flatMap(findBoxLineReduction),
    };
  },
};

function findBoxLineReduction(line: CellBlock): ReadonlyArray<SolverAction> {
  const boxes = [line.cells[0].box, line.cells[3].box, line.cells[6].box];
  const actions: Array<SolverAction> = [];

  for (let i = 1; i <= 9; i++) {
    const cells = line.cells.filter((c) => c.candidates.includes(i));

    if (cells.length >= 2) {
      for (const box of boxes) {
        if (cells.some((c) => c.box !== box)) continue;

        const others = box.cells.filter(
          (c) =>
            (line.type === "row" ? c.row : c.column) !== line &&
            c.candidates.includes(i)
        );

        if (others.length) {
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
