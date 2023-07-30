import * as PIXI from "pixi.js";

interface GameObject {
  displayObject: PIXI.DisplayObject;
  setPosition(x: number, y: number): void;
  setRotation(radians: number): void;
}

export default GameObject;
