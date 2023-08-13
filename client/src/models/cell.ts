import * as PIXI from "pixi.js";

interface Cell {
  cost: number;
  bestCost: number;
  bestDirection: PIXI.Point;
  i: number;
  j: number;
  position: PIXI.Point;
}

export default Cell;
