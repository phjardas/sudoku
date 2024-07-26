import { Cell, CellBlock } from "../game";
import { union } from "../utils";
import type { SolverAction, SolverStrategy } from "./types";

export const hiddenTriples: SolverStrategy = {
  id: "hidden-triples",
  label: "Hidden Triples",
  perform: ({ board }) => {
    return {
      actions: [...board.boxes, ...board.rows, ...board.columns].flatMap(
        findHiddenTriples
      ),
    };
  },
};

function findHiddenTriples(box: CellBlock): ReadonlyArray<SolverAction> {
  const actions: Array<SolverAction> = [];

  const cells = Array.from(new Array(9), (_, i) =>
    box.cells.filter((c) => c.candidates.includes(i + 1))
  );

  for (let i = 0; i < cells.length; i++) {
    const cellsA = cells[i];
    if (cellsA.length < 2 || cellsA.length > 3) continue;

    for (let j = i + 1; j < cells.length; j++) {
      const cellsB = cells[j];
      if (cellsB.length < 2 || cellsB.length > 3) continue;

      for (let k = j + 1; k < cells.length; k++) {
        const cellsC = cells[k];
        if (cellsC.length < 2 || cellsC.length > 3) continue;
        const unionABC = union(cellsA, cellsB, cellsC);
        if (unionABC.length === 3) {
          console.log(
            "%s contains a hidden triple with %s: %s",
            box.toString(),
            [i + 1, j + 1, k + 1].join(", "),
            unionABC.join(", ")
          );
          actions.push(...createTupleActions(unionABC, [i + 1, j + 1, k + 1]));
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

  if (!removals.length) return [];

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
