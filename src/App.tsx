import { useMemo } from "react";
import { parseBoard } from "./game";
import GameDisplay from "./GameDisplay";

const a =
  "3-9---4--2--7-9----87------75--6-23-6--9-4--8-28-5--41------59----1-6--7--6---1-4";
const b =
  "3-9---47-2--7-98---87---9--7548612396--924758928357641------596---1-63-7--6---1-4";

export default function App() {
  const board = useMemo(() => parseBoard(b), []);

  return <GameDisplay board={board} />;
}
