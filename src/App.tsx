import { useMemo } from "react";
import { parseBoard } from "./game";
import GameDisplay from "./GameDisplay";

const nakedPairs =
  "400000938032094100095300240370609004529001673604703090957008300003900400240030709";
const nakedTriples =
  "294513006600842319300697254000056000040080060000470000730164005900735001400928637";
const hiddenPairs =
  "000000000904607000076804100309701080708000301051308702007502610005403208000000000";
const hiddenTriples =
  "000001030231090000065003100678924300103050006000136700009360570006019843300000000";
const pointingPairs =
  "017903600000080000900000507072010430000402070064370250701000065000030000005601720";

export default function App() {
  const board = useMemo(() => parseBoard(hiddenTriples), []);

  return <GameDisplay board={board} />;
}
