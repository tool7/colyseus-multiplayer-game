import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import GameObject from "../models/game-object";
import { CAMERA_SMOOTH_SPEED, CAMERA_SPEED } from "../utils/constants";
import { lerp } from "../utils/helpers";

class Camera extends GameObject {
  // ======== GLOBAL STATIC DATA ========
  private static _zoomLevel = 1;
  private static setZoomLevel(level: number) {
    this._zoomLevel = level;
    this.events.emit("zoom-change", level);
  }

  static events = new PIXI.utils.EventEmitter();
  static get zoomLevel() {
    return this._zoomLevel;
  }
  // ====================================

  private wasdFlags = { W: false, A: false, S: false, D: false };
  private isDragging: boolean = false;
  private target: PIXI.Point;
  private smoothedTarget: PIXI.Point;

  constructor(private viewport: Viewport) {
    super();

    const { center } = this.viewport;
    this.target = new PIXI.Point(center.x, center.y);
    this.smoothedTarget = new PIXI.Point(center.x, center.y);

    this.initViewportControls();
    this.initKeyboardControls();
  }

  private initViewportControls() {
    this.viewport
      .drag({ mouseButtons: "middle" })
      .wheel({ smooth: 8, center: this.smoothedTarget })
      .clampZoom({ maxScale: 1, minScale: 0.25 })
      .animate({ ease: "linear", time: 1000 });

    this.viewport.on("zoomed", () => {
      Camera.setZoomLevel(this.viewport.scaled);
    });

    this.viewport.on("drag-start", () => {
      this.isDragging = true;
    });

    this.viewport.on("drag-end", (e) => {
      this.target.x = this.viewport.center.x;
      this.target.y = this.viewport.center.y;

      this.isDragging = false;
    });

    Camera.setZoomLevel(this.viewport.scaled);
  }

  private initKeyboardControls() {
    window.addEventListener("keydown", (e) => {
      const key = e.key.toUpperCase();
      if (!["W", "A", "S", "D"].includes(key)) {
        return;
      }
      this.wasdFlags[key] = true;
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toUpperCase();
      if (!["W", "A", "S", "D"].includes(key)) {
        return;
      }
      this.wasdFlags[key] = false;
    });
  }

  private isAnyKeyPressed = () => Object.values(this.wasdFlags).some((key) => !!key);

  get renderObject() {
    return new PIXI.Container();
  }
  get transform() {
    return new PIXI.Transform();
  }

  update() {
    if (this.isDragging) {
      return;
    }

    const { center } = this.viewport;
    if (
      !this.isAnyKeyPressed() &&
      Math.abs(center.x - this.target.x) < 1e-4 &&
      Math.abs(center.y - this.target.y) < 1e-4
    ) {
      return;
    }

    const { W, A, S, D } = this.wasdFlags;
    const diagonalCameraSpeed = CAMERA_SPEED * 0.7;

    if (W && D) {
      this.target.x += diagonalCameraSpeed;
      this.target.y -= diagonalCameraSpeed;
    } else if (D && S) {
      this.target.x += diagonalCameraSpeed;
      this.target.y += diagonalCameraSpeed;
    } else if (S && A) {
      this.target.x -= diagonalCameraSpeed;
      this.target.y += diagonalCameraSpeed;
    } else if (A && W) {
      this.target.x -= diagonalCameraSpeed;
      this.target.y -= diagonalCameraSpeed;
    } else if (W) {
      this.target.y -= CAMERA_SPEED;
    } else if (A) {
      this.target.x -= CAMERA_SPEED;
    } else if (S) {
      this.target.y += CAMERA_SPEED;
    } else if (D) {
      this.target.x += CAMERA_SPEED;
    }

    this.smoothedTarget.x = lerp(center.x, this.target.x, CAMERA_SMOOTH_SPEED);
    this.smoothedTarget.y = lerp(center.y, this.target.y, CAMERA_SMOOTH_SPEED);
    this.viewport.moveCenter(this.smoothedTarget.x, this.smoothedTarget.y);
  }
}

export default Camera;
