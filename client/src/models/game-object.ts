import * as PIXI from "pixi.js";

interface GameObject {
  displayObject: PIXI.DisplayObject;
  position: PIXI.Point;
  rotation: number;
  update: (delta: number) => void;
}

export default GameObject;
