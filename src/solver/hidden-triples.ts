import { Cell, CellBlock } from "../game";
import { intersection, union } from "../utils";
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
  const cells = Array.from(new Array(9), (_, i) =>
    box.cells.filter((c) => c.candidates.includes(i + 1))
  );

  const actions: Array<SolverAction> = [];

  for (let i = 1; i <= 9; i++) {
    const cellsA = cells[i - 1];

    if (cellsA.length === 2 || cellsA.length === 3) {
      for (let j = i + 1; j <= 9; j++) {
        const cellsB = cells[j - 1];

        if (cellsB.length === 2 || cellsB.length === 3) {
          for (let k = j + 1; k <= 9; k++) {
            const cellsC = cells[k - 1];

            if (cellsC.length === 2 || cellsC.length === 3) {
              const cellUnion = union(cellsA, cellsB, cellsC);

              if (
                cellUnion.length === 3 &&
                intersection(cellUnion, cellsA).length >= 2 &&
                intersection(cellUnion, cellsB).length >= 2 &&
                intersection(cellUnion, cellsC).length >= 2
              ) {
                console.log(
                  "%s has a hidden triple with %s in %s",
                  box.toString(),
                  [i, j, k].join(", "),
                  cellUnion.join(", ")
                );
                actions.push(...createTupleActions(cellUnion, [i, j, k]));
              }
            }
          }
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
