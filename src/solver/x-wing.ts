import { type Board, type Cell, type CellBlock, possibleValues } from "../game";
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

type LineSpec = {
  getFromBoard: (board: Board) => ReadonlyArray<CellBlock>;
  get: (cell: Cell) => CellBlock;
  getOther: (cell: Cell) => CellBlock;
};

const rowSpec: LineSpec = {
  getFromBoard: (board) => board.rows,
  get: (cell) => cell.row,
  getOther: (cell) => cell.column,
};

const columnSpec: LineSpec = {
  getFromBoard: (board) => board.columns,
  get: (cell) => cell.column,
  getOther: (cell) => cell.row,
};

function findXWings(board: Board, value: number): ReadonlyArray<SolverAction> {
  return [
    ...findLineXWings(board, rowSpec, value),
    ...findLineXWings(board, columnSpec, value),
  ];
}

function findLineXWings(
  board: Board,
  spec: LineSpec,
  value: number
): ReadonlyArray<SolverAction> {
  const actions: Array<SolverAction> = [];

  const candidateLines = spec
    .getFromBoard(board)
    .filter(
      (line) =>
        line.cells.filter((cell) => cell.candidates.includes(value)).length ===
        2
    );

  for (let i = 0; i < candidateLines.length; i++) {
    const lineA = candidateLines[i];
    const orthoA = lineA.cells
      .filter((cell) => cell.candidates.includes(value))
      .map(spec.getOther);

    for (let j = i + 1; j < candidateLines.length; j++) {
      const lineB = candidateLines[j];
      const orthoB = lineB.cells
        .filter((cell) => cell.candidates.includes(value))
        .map(spec.getOther);

      if (arrayEquals(orthoA, orthoB)) {
        const removals: ReadonlyArray<SolverAction> = orthoA.flatMap((column) =>
          column.cells
            .filter(
              (c) =>
                spec.get(c) !== lineA &&
                spec.get(c) !== lineB &&
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
            ...lineA.cells,
            ...lineB.cells,
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
