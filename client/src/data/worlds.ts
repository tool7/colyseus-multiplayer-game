import * as PIXI from "pixi.js";

import WorldConfig from "../models/world-config";
import PlayerColor from "../models/player-color";

type WorldName = "WORLD_1" | "WORLD_2" | "WORLD_3" | "DUMMY";

const WORLDS: Record<WorldName, WorldConfig> = {
  WORLD_1: { playerSetup: [], islands: [], storms: [] },
  WORLD_2: { playerSetup: [], islands: [], storms: [] },
  WORLD_3: { playerSetup: [], islands: [], storms: [] },
  DUMMY: {
    playerSetup: [
      { initialPosition: { x: 1400, y: 200 }, initialRotation: -1, color: PlayerColor.RED },
      { initialPosition: { x: 1300, y: 1700 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
      { initialPosition: { x: 1800, y: 200 }, initialRotation: 1, color: PlayerColor.BLUE },
    ],
    islands: [
      new PIXI.Polygon([
        { x: 600, y: 370 },
        { x: 700, y: 260 },
        { x: 780, y: 420 },
        { x: 730, y: 570 },
        { x: 590, y: 520 },
      ]),
      new PIXI.Polygon([
        { x: 1600, y: 1370 },
        { x: 1700, y: 1360 },
        { x: 1780, y: 1420 },
        { x: 1730, y: 1570 },
        { x: 1590, y: 1520 },
      ]),
      new PIXI.Polygon([
        { x: 1600, y: 500 },
        { x: 1700, y: 600 },
        { x: 1780, y: 700 },
        { x: 1730, y: 800 },
        { x: 1590, y: 900 },
        { x: 1200, y: 800 },
        { x: 1150, y: 600 },
        { x: 1300, y: 500 },
      ]),
    ],
    storms: [
      new PIXI.Polygon([
        { x: 1000, y: 1100 },
        { x: 1100, y: 1200 },
        { x: 1180, y: 1300 },
        { x: 1130, y: 1400 },
        { x: 990, y: 1550 },
        { x: 750, y: 1600 },
        { x: 600, y: 1400 },
        { x: 550, y: 1200 },
        { x: 800, y: 1050 },
      ]),
    ],
  },
};

export default WORLDS;
