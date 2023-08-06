import * as PIXI from "pixi.js";

interface GameObject {
  displayObject: PIXI.DisplayObject;

  // TODO: Change to PIXI.Transform
  position: PIXI.Point;
  rotation: number;

  update: (delta: number) => void;
}

export default GameObject;
