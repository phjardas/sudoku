import { useCallback, useEffect, useState } from "react";
import { possibleValues } from "./game";

type Bookmark = { label: string; code: string };

const bookmarks: ReadonlyArray<Bookmark> = [
  {
    label: "Gentle",
    code: "....6..3......95.6.41...2..8..7...25..........5..13..8..3...76.4.28......1..2....",
  },
  {
    label: "Naked Pairs",
    code: "4.....938.32.941...953..24.37.6.9..4529..16736.47.3.9.957..83....39..4..24..3.7.9",
  },
  {
    label: "Naked Triples",
    code: "294513..66..8423193..697254....56....4..8..6....47....73.164..59..735..14..928637",
  },
  {
    label: "Hidden Pairs",
    code: ".........9.46.7....768.41..3.97.1.8.7.8...3.1.513.87.2..75.261...54.32.8.........",
  },
  {
    label: "Hidden Triples",
    code: ".....1.3.231.9.....65..31..6789243..1.3.5...6...1367....936.57...6.198433........",
  },
  {
    label: "Pointing Pairs",
    code: ".179.36......8....9.....5.7.72.1.43....4.2.7..6437.25.7.1....65....3......56.172.",
  },
  {
    label: "X-Wing",
    code: "1.....569492.561.8.561.924...964.8.1.64.1....218.356.4.4.5...169.5.614.2621.....5",
  },
  {
    label: "X-Wing 2",
    code: ".......9476.91..5..9...2.81.7..5..1....7.9....8..31.6724.1...7..1..9..459.....1..",
  },
  {
    label: "Rectangle Elimination",
    code: "....6..3.3....95.6641...2..83.7..1251.........5..13..8.83...7624.28......1..2....",
  },
];

export default function StartGame({
  setBoardCode,
}: {
  setBoardCode: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        Start new game
      </button>
      {open && (
        <StartGameDialog
          setBoardCode={setBoardCode}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
const legalValues = possibleValues.map((s) => s.toString());

function getCellIndex(box: number, cell: number) {
  const boxOffset = Math.floor(box / 3) * 27 + (box % 3) * 3;
  const rowOffset = Math.floor(cell / 3) * 9;
  const columnOffset = cell % 3;
  return boxOffset + rowOffset + columnOffset;
}

function getCellCodes(code: string) {
  return Array.from(new Array(81), (_, i) =>
    legalValues.includes(code[i]) ? code[i] : ""
  );
}

function StartGameDialog({
  setBoardCode,
  onClose,
}: {
  setBoardCode: (code: string) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [cellCodes, setCellCodes] = useState(getCellCodes(code));

  useEffect(() => setCellCodes(getCellCodes(code)), [code]);
  useEffect(
    () =>
      setCode(
        cellCodes.map((c) => (legalValues.includes(c) ? c : ".")).join("")
      ),
    [cellCodes]
  );

  const setCell = useCallback((box: number, cell: number, value: string) => {
    const index = getCellIndex(box, cell);
    setCellCodes((code) =>
      code.map((c, i) =>
        i === index ? (legalValues.includes(value) ? value : "") : c
      )
    );
  }, []);

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Start new game
                </h3>
                <div className="mt-2">
                  <div className="inline-grid grid-cols-3 border border-black">
                    {indices.map((box) => (
                      <div
                        key={box}
                        className="inline-grid grid-cols-3 border border-black"
                      >
                        {indices.map((cell) => (
                          <div
                            key={cell}
                            className="border-[0.5px] border-black w-8 h-8 overflow-hidden flex justify-center items-center"
                          >
                            <input
                              value={cellCodes[getCellIndex(box, cell)] ?? ""}
                              onChange={(e) => {
                                setCell(box, cell, e.currentTarget.value);
                                document
                                  .getElementById(
                                    `cell-${getCellIndex(box, cell) + 1}`
                                  )
                                  ?.focus();
                              }}
                              className="w-full text-center"
                              id={`cell-${getCellIndex(box, cell)}`}
                              tabIndex={getCellIndex(box, cell) + 1}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <label htmlFor="code" className="text-sm">
                      Board code
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full border border-gray-700 rounded px-1 py-1 text-sm"
                      id="code"
                    />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="bookmarks" className="text-sm">
                      Saved games
                    </label>
                    <select
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full border border-gray-700 rounded px-1 py-1 text-sm"
                      id="bookmarks"
                    >
                      <option value=""></option>
                      {bookmarks.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                onClick={() => {
                  setBoardCode(code);
                  onClose();
                }}
              >
                Start new game
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => onClose()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
