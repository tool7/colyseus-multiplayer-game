import * as PIXI from "pixi.js";

import { distanceBetweenTwoPoints } from "../utils/point";
import Ship from "./ship";

class ShipController {
  constructor(private ship: Ship) {}

  goTo(target: PIXI.Point): PIXI.Point {
    const shipPosition = this.ship.displayObject.position;

    const toMouseDirection = new PIXI.Point(target.x - shipPosition.x, target.y - shipPosition.y);
    const angleToMouse = Math.atan2(toMouseDirection.y, toMouseDirection.x);

    const distMouseShip = distanceBetweenTwoPoints(target, shipPosition);
    const shipSpeed = distMouseShip * 0.05;

    return new PIXI.Point(Math.cos(angleToMouse) * shipSpeed, Math.sin(angleToMouse) * shipSpeed);
  }
}

export default ShipController;
