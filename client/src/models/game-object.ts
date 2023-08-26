import * as PIXI from "pixi.js";
import { nanoid } from "nanoid";

abstract class GameObject {
  id: string;

  abstract transform: PIXI.Transform;
  abstract renderObject: PIXI.DisplayObject;
  abstract update(delta: number): void;

  constructor() {
    this.id = nanoid();
  }

  log() {
    console.table({
      id: this.id,
      position: this.transform.position,
      rotation: this.transform.rotation,
    });
  }
}

export default GameObject;
