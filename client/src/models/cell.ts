import * as PIXI from "pixi.js";

interface Cell {
  cost: number;
  bestCost: number;
  bestDirection: PIXI.Point;
  i: number;
  j: number;
  position: PIXI.Point;

  // TODO: Temporary solution
  isRoughSea: boolean;
  isObstacle: boolean;
}

export default Cell;
