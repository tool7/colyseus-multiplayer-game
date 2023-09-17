import { WorldConfig } from "../models/world-config";
import PlayerColor from "../models/player-color";
import ISLANDS from "./islands";

type WorldName = "WORLD_1" | "WORLD_2" | "WORLD_3" | "WORLD_4";

const WORLDS: Record<WorldName, WorldConfig> = {
  WORLD_1: { playerSetup: [], islands: [], storms: [] },
  WORLD_2: { playerSetup: [], islands: [], storms: [] },
  WORLD_3: { playerSetup: [], islands: [], storms: [] },
  WORLD_4: {
    playerSetup: [
      { initialPosition: { x: 1400, y: 200 }, initialRotation: -1, color: PlayerColor.RED },
      { initialPosition: { x: 1300, y: 1700 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
      { initialPosition: { x: 1800, y: 200 }, initialRotation: 1, color: PlayerColor.BLUE },
    ],
    islands: [
      {
        ...ISLANDS.HIGH_3,
        position: { x: 600, y: 1000 },
        scaleFactor: 1.2,
      },
    ],
    storms: [],
  },
};

export default WORLDS;
