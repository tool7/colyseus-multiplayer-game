import * as PIXI from "pixi.js";

import PlayerColor from "./player-color";

type PlayerSetup = {
  initialPosition: { x: number; y: number };
  initialRotation: number;
  color: PlayerColor;
};
type Island = PIXI.Polygon;
type Storm = PIXI.Polygon;

interface WorldConfig {
  playerSetup: PlayerSetup[];
  islands: Island[];
  storms: Storm[];
}

export default WorldConfig;
