import { Cell, CellBlock } from "../game";
import { containsAny, intersection, union } from "../utils";
import type { SolverAction, SolverStrategy } from "./types";

export const nakedTriples: SolverStrategy = {
  id: "naked-triples",
  label: "Naked Triples",
  perform: ({ board }) => {
    return {
      actions: board.boxes.flatMap(findNakedTriples),
    };
  },
};

function findNakedTriples(box: CellBlock): ReadonlyArray<SolverAction> {
  const candidateCells = box.cells.filter(
    (c) => (!c.value && c.candidates.length === 2) || c.candidates.length === 3
  );

  const tuples: Array<ReadonlyArray<Cell>> = [];

  for (let i = 0; i < candidateCells.length; i++) {
    const cell1 = candidateCells[i];

    for (let j = i + 1; j < candidateCells.length; j++) {
      const cell2 = candidateCells[j];

      for (let k = j + 1; k < candidateCells.length; k++) {
        const cell3 = candidateCells[k];
        const candidates = union(
          cell1.candidates,
          cell2.candidates,
          cell3.candidates
        );
        const int1 = intersection(candidates, cell1.candidates).length;
        const int2 = intersection(candidates, cell2.candidates).length;
        const int3 = intersection(candidates, cell3.candidates).length;

        if (
          candidates.length === 3 &&
          (int1 === 2 || int1 === 3) &&
          (int2 === 2 || int2 === 3) &&
          (int3 === 2 || int3 === 3)
        ) {
          tuples.push([cell1, cell2, cell3]);
        }
      }
    }
  }

  return tuples.flatMap((tuple) => createTupleActions(box, tuple));
}

function createTupleActions(
  box: CellBlock,
  tuple: ReadonlyArray<Cell>
): ReadonlyArray<SolverAction> {
  const candidates = union(...tuple.map((c) => c.candidates));

  const removals: ReadonlyArray<SolverAction> = box.cells
    .filter(
      (c) =>
        !tuple.includes(c) && containsAny(c.candidates, tuple[0].candidates)
    )
    .flatMap((cell) =>
      candidates.map((candidate) => ({
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
