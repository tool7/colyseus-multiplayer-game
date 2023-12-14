import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import GameObject from "../models/game-object";
import { CAMERA_SPEED } from "../utils/constants";

class CameraController extends GameObject {
  private wasdFlags = { W: false, A: false, S: false, D: false };

  constructor(private viewport: Viewport) {
    super();

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

  get renderObject() {
    return new PIXI.Container();
  }
  get transform() {
    return new PIXI.Transform();
  }

  update() {
    const { W, A, S, D } = this.wasdFlags;
    const { center } = this.viewport;
    const diagonalCameraSpeed = CAMERA_SPEED * 0.7;

    if (W && D) {
      this.viewport.moveCenter(center.x + diagonalCameraSpeed, center.y - diagonalCameraSpeed);
    } else if (D && S) {
      this.viewport.moveCenter(center.x + diagonalCameraSpeed, center.y + diagonalCameraSpeed);
    } else if (S && A) {
      this.viewport.moveCenter(center.x - diagonalCameraSpeed, center.y + diagonalCameraSpeed);
    } else if (A && W) {
      this.viewport.moveCenter(center.x - diagonalCameraSpeed, center.y - diagonalCameraSpeed);
    } else if (W) {
      this.viewport.moveCenter(center.x, center.y - CAMERA_SPEED);
    } else if (A) {
      this.viewport.moveCenter(center.x - CAMERA_SPEED, center.y);
    } else if (S) {
      this.viewport.moveCenter(center.x, center.y + CAMERA_SPEED);
    } else if (D) {
      this.viewport.moveCenter(center.x + CAMERA_SPEED, center.y);
    }
  }
}

export default CameraController;
