import { Cell, CellBlock } from "../game";
import { arrayEquals, containsAny } from "../utils";
import type { SolverAction, SolverStrategy } from "./types";

export const nakedPairs: SolverStrategy = {
  id: "naked-pairs",
  label: "Naked Pairs",
  perform: ({ board }) => {
    return {
      actions: [...board.boxes, ...board.rows, ...board.columns].flatMap(
        findNakedPairs
      ),
    };
  },
};

function findNakedPairs(box: CellBlock): ReadonlyArray<SolverAction> {
  const candidateCells = box.cells.filter(
    (c) => !c.value && c.candidates.length === 2
  );

  const tuples: Array<ReadonlyArray<Cell>> = [];

  for (let i = 0; i < candidateCells.length; i++) {
    const cell1 = candidateCells[i];

    for (let j = i + 1; j < candidateCells.length; j++) {
      const cell2 = candidateCells[j];
      if (arrayEquals(cell1.candidates, cell2.candidates)) {
        tuples.push([cell1, cell2]);
      }
    }
  }

  return tuples.flatMap((tuple) => createTupleActions(box, tuple));
}

function createTupleActions(
  box: CellBlock,
  tuple: ReadonlyArray<Cell>
): ReadonlyArray<SolverAction> {
  const removals: ReadonlyArray<SolverAction> = box.cells
    .filter(
      (c) =>
        !tuple.includes(c) && containsAny(c.candidates, tuple[0].candidates)
    )
    .flatMap((cell) =>
      tuple[0].candidates.map((candidate) => ({
        type: "remove-candidate",
        row: cell.row.nr,
        column: cell.column.nr,
        value: candidate,
      }))
    );

  if (!removals.length) return [];

  const highlights: ReadonlyArray<SolverAction> = tuple.flatMap((cell) =>
    tuple[0].candidates.map((candidate) => ({
      type: "highlight-candidate",
      row: cell.row.nr,
      column: cell.column.nr,
      value: candidate,
      color: 1,
    }))
  );

  return [...highlights, ...removals];
}
