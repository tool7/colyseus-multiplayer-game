import * as PIXI from "pixi.js";

interface GameObject {
  displayObject: PIXI.DisplayObject;
  transform: PIXI.Transform;
  update: (delta: number) => void;
}

export default GameObject;
