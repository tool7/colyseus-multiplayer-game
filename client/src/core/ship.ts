import * as PIXI from "pixi.js";

import {
  SHIP_HULL_SPRITE_SRC,
  PLAYER_COLOR_SHIP_SAILS_SPRITES,
  SHIP_DEFAULT_VELOCITY,
  SHIP_TARGET_HALT_MIN_DISTANCE,
} from "../utils/constants";
import { distanceBetweenPoints } from "../utils/helpers";
import GameObject from "../models/game-object";
import PlayerColor from "../models/player-color";

class Ship implements GameObject {
  private hull: PIXI.Sprite;
  private sails: PIXI.Sprite;
  private container: PIXI.Container;
  private velocity: number;
  private direction: PIXI.Point;
  private destination: PIXI.Point;

  constructor(playerColor: PlayerColor) {
    this.container = new PIXI.Container();

    const hullTexture = PIXI.Texture.from(SHIP_HULL_SPRITE_SRC);
    const sailsTexture = PIXI.Texture.from(PLAYER_COLOR_SHIP_SAILS_SPRITES[playerColor]);

    this.hull = PIXI.Sprite.from(hullTexture);
    this.sails = PIXI.Sprite.from(sailsTexture);

    this.hull.width = hullTexture.width;
    this.hull.height = hullTexture.height;
    this.hull.anchor.set(0.5, 0.5);

    this.sails.width = sailsTexture.width;
    this.sails.height = sailsTexture.height;
    this.sails.anchor.set(0.5, 0.5);

    this.container.addChild(this.hull);
    this.container.addChild(this.sails);
    this.container.eventMode = "static";

    this.velocity = SHIP_DEFAULT_VELOCITY;
    this.direction = new PIXI.Point();
    this.destination = new PIXI.Point();
  }

  get displayObject() {
    return this.container;
  }
  get position() {
    return this.container.position;
  }
  set position({ x, y }: PIXI.Point) {
    this.container.position.set(x, y);
  }
  get rotation() {
    return this.container.rotation;
  }
  set rotation(radians: number) {
    this.container.rotation = radians;
  }

  goTo(target: PIXI.Point): void {
    this.destination = new PIXI.Point(target.x, target.y);

    const dx = target.x - this.container.x;
    const dy = target.y - this.container.y;
    const angle = Math.atan2(dy, dx);

    this.direction.x = Math.cos(angle);
    this.direction.y = Math.sin(angle);
  }

  update(delta: number): void {
    const distance = distanceBetweenPoints(this.container.position, this.destination);

    if (distance < SHIP_TARGET_HALT_MIN_DISTANCE) {
      this.container.x = this.destination.x;
      this.container.y = this.destination.y;
    } else {
      this.container.position.x += this.direction.x * this.velocity * delta;
      this.container.position.y += this.direction.y * this.velocity * delta;
    }
  }
}

export default Ship;
