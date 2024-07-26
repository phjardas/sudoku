export const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export class Cell {
  candidates: ReadonlyArray<number>;

  constructor(
    public readonly row: CellBlock,
    public readonly column: CellBlock,
    public readonly box: CellBlock,
    public value?: number
  ) {
    this.candidates = value ? [] : possibleValues;
  }

  toString() {
    return (
      coordinates(this.row.nr, this.column.nr) +
      "(" +
      (this.value ?? this.candidates.join("")) +
      ")"
    );
  }
}

export class CellBlock {
  cells: Array<Cell> = [];

  constructor(
    readonly type: "row" | "column" | "box",
    readonly nr: number
  ) {}

  get values(): ReadonlyArray<number> {
    return this.cells.map((c) => c.value).filter((n) => n !== undefined);
  }

  getCellsForCandidate(candidate: number): ReadonlyArray<Cell> {
    return this.cells.filter((c) => c.candidates.includes(candidate));
  }

  toString() {
    switch (this.type) {
      case "row":
        return "Row " + row(this.nr);
      case "column":
        return "Column " + (this.nr + 1);
      case "box":
        return "Box " + (this.nr + 1);
    }
  }
}

export class Board {
  readonly cells: ReadonlyArray<Cell>;
  readonly rows: ReadonlyArray<CellBlock> = Array.from(
    new Array(9),
    (_, i) => new CellBlock("row", i)
  );
  readonly columns: ReadonlyArray<CellBlock> = Array.from(
    new Array(9),
    (_, i) => new CellBlock("column", i)
  );
  readonly boxes: ReadonlyArray<CellBlock> = Array.from(
    new Array(9),
    (_, i) => new CellBlock("box", i)
  );

  constructor(hints: ReadonlyArray<number | undefined>) {
    this.cells = Array.from(new Array(81), (_, i) => {
      const row = this.rows[Math.floor(i / 9)];
      const column = this.columns[i % 9];
      const box = this.boxes[Math.floor(i / 27) * 3 + Math.floor((i % 9) / 3)];
      const cell = new Cell(row, column, box, hints[i]);
      row.cells.push(cell);
      column.cells.push(cell);
      box.cells.push(cell);
      return cell;
    });
  }
}

export function parseBoard(input: string): Board {
  if (input.length !== 81)
    throw new Error(`Invalid input length: ${input.length}`);
  return new Board(
    input
      .split("")
      .map((s) => parseInt(s))
      .map((s) => (isNaN(s) || s < 1 || s > 9 ? undefined : s))
  );
}

export function row(nr: number): string {
  return "ABCDEFGHJ"[nr];
}

export function coordinates(rowNr: number, column: number): string {
  return row(rowNr) + (column + 1);
}
