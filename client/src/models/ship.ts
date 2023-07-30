import * as PIXI from "pixi.js";

import { SHIP_HULL_SPRITE_SRC, PLAYER_COLOR_SHIP_SAILS_SPRITES } from "../utils/constants";
import GameObject from "./game-object";
import PlayerColor from "./player-color";

class Ship implements GameObject {
  private hull: PIXI.Sprite;
  private sails: PIXI.Sprite;

  container: PIXI.Container;

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
  }

  get displayObject() {
    return this.container;
  }

  setPosition(x: number, y: number) {
    this.container.position.set(x, y);
  }

  setRotation(radians: number) {
    this.container.rotation = radians;
  }
}

export default Ship;
