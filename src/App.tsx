import { useMemo, useState } from "react";
import { parseBoard } from "./game";
import GameDisplay from "./GameDisplay";

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

export default function App() {
  const [boardCode, setBoardCode] = useState(bookmarks[7].code);
  const board = useMemo(() => parseBoard(boardCode), []);

  return (
    <div className="p-4">
      <GameDisplay board={board} />
    </div>
  );
}
