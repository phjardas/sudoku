import { useMemo, useState } from "react";
import { parseBoard } from "./game";
import GameDisplay from "./GameDisplay";
import StartGameDialog from "./StartGameDialog";

export default function App() {
  const [boardCode, setBoardCode] = useState("");
  const board = useMemo(() => boardCode && parseBoard(boardCode), [boardCode]);

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">Sudoku Solver</h1>
      {board && (
        <div className="mb-4">
          <GameDisplay key={boardCode} board={board} />
        </div>
      )}
      <StartGameDialog setBoardCode={setBoardCode} />
    </div>
  );
}
