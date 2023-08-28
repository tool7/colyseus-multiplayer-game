import * as PIXI from "pixi.js";

class CameraState {
  static events = new PIXI.utils.EventEmitter();

  private static _zoomLevel = 1;

  static get zoomLevel() {
    return this._zoomLevel;
  }

  static setZoomLevel(level: number) {
    this._zoomLevel = level;
    this.events.emit("zoom-change", level);
  }
}

export default CameraState;
