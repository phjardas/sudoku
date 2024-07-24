import type { SolverStrategy } from "./types";

export const nakedSingles: SolverStrategy = {
  id: "naked-singles",
  label: "Naked Singles",
  perform: ({ board }) => {
    return {
      actions: board.cells
        .filter((c) => c.candidates.length === 1)
        .map((cell) => ({
          type: "set-value",
          row: cell.row.nr,
          column: cell.column.nr,
          value: cell.candidates[0],
        })),
    };
  },
};
