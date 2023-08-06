import * as PIXI from "pixi.js";

import GameObject from "../models/game-object";

class MouseAreaSelection implements GameObject {
  private selectedAreaStartPosition: PIXI.Point;
  private selectedAreaRectangle: PIXI.Rectangle;
  private selectedAreaGraphics: PIXI.Graphics;

  selectionEvent: PIXI.utils.EventEmitter;

  constructor(private world: PIXI.DisplayObject) {
    this.selectedAreaStartPosition = new PIXI.Point();
    this.selectedAreaRectangle = new PIXI.Rectangle();
    this.selectedAreaGraphics = new PIXI.Graphics();
    this.selectedAreaGraphics.visible = false;

    this.selectionEvent = new PIXI.utils.EventEmitter();

    this.world.on("mousedown", (e) => {
      this.selectedAreaGraphics.visible = true;

      const { x, y } = e.global;
      this.selectedAreaStartPosition.set(x, y);
    });

    this.world.on("mousemove", (e) => {
      if (!this.selectedAreaGraphics.visible) {
        return;
      }

      const topLeftX = Math.min(this.selectedAreaStartPosition.x, e.global.x);
      const topLeftY = Math.min(this.selectedAreaStartPosition.y, e.global.y);
      const areaWidth = Math.abs(this.selectedAreaStartPosition.x - e.global.x);
      const areaHeight = Math.abs(this.selectedAreaStartPosition.y - e.global.y);
      this.selectedAreaRectangle = new PIXI.Rectangle(topLeftX, topLeftY, areaWidth, areaHeight);

      this.selectedAreaGraphics.clear();
      this.selectedAreaGraphics.lineStyle(1, 0xf2ab99, 1);
      this.selectedAreaGraphics.beginFill(0xf2ab99, 0.25);
      this.selectedAreaGraphics.drawRect(topLeftX, topLeftY, areaWidth, areaHeight);
      this.selectedAreaGraphics.endFill();
    });

    this.world.on("mouseup", () => {
      this.selectedAreaGraphics.clear();
      this.selectedAreaGraphics.visible = false;

      this.selectionEvent.emit("select", this.selectedAreaRectangle);
    });
  }

  get displayObject() {
    return this.selectedAreaGraphics;
  }
  get position() {
    return this.selectedAreaGraphics.position;
  }
  set position({ x, y }: PIXI.Point) {
    this.selectedAreaGraphics.position.set(x, y);
  }
  get rotation() {
    return this.selectedAreaGraphics.rotation;
  }
  set rotation(radians: number) {
    this.selectedAreaGraphics.rotation = radians;
  }

  update(delta: number): void {}
}

export default MouseAreaSelection;
