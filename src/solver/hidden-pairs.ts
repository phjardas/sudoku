import { Cell, CellBlock } from "../game";
import { arrayEquals } from "../utils";
import type { SolverAction, SolverStrategy } from "./types";

export const hiddenPairs: SolverStrategy = {
  id: "hidden-pairs",
  label: "Hidden Pairs",
  perform: ({ board }) => {
    return {
      actions: [...board.boxes, ...board.rows, ...board.columns].flatMap(
        findHiddenPairs
      ),
    };
  },
};

function findHiddenPairs(box: CellBlock): ReadonlyArray<SolverAction> {
  const actions: Array<SolverAction> = [];

  for (let i = 1; i <= 9; i++) {
    const cellsA = box.cells.filter((c) => c.candidates.includes(i));

    if (cellsA.length === 2) {
      for (let j = i + 1; j <= 9; j++) {
        const cellsB = box.cells.filter((c) => c.candidates.includes(j));

        if (
          arrayEquals(cellsA, cellsB) &&
          cellsA.some((cell) => cell.candidates.length > 2)
        ) {
          actions.push(...createTupleActions(cellsA, [i, j]));
        }
      }
    }
  }

  return actions;
}

function createTupleActions(
  tuple: ReadonlyArray<Cell>,
  candidates: ReadonlyArray<number>
): ReadonlyArray<SolverAction> {
  const removals: ReadonlyArray<SolverAction> = tuple.flatMap((cell) =>
    cell.candidates
      .filter((c) => !candidates.includes(c))
      .map((candidate) => ({
        type: "remove-candidate",
        row: cell.row.nr,
        column: cell.column.nr,
        value: candidate,
      }))
  );

  const highlights: ReadonlyArray<SolverAction> = tuple.flatMap((cell) =>
    candidates.map((candidate) => ({
      type: "highlight-candidate",
      row: cell.row.nr,
      column: cell.column.nr,
      value: candidate,
      color: 1,
    }))
  );

  return [...highlights, ...removals];
}
