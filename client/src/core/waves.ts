import * as PIXI from "pixi.js";

import GameObject from "../models/game-object";
import WindDirection from "../models/wind-direction";
import {
  WAVES_SPRITES,
  MAP_GRID_CELL_SIZE,
  MAP_GRID_HEIGHT,
  MAP_GRID_WIDTH,
  WAVES_SPRITE_OPACITY,
} from "../utils/constants";
import { mapWindDirectionToWavesVector } from "../utils/helpers";

class Waves extends GameObject {
  private container: PIXI.Container;
  private wavesVector: PIXI.Point;
  private wavesSpeed: number;
  private wavesTilingSprite: PIXI.TilingSprite;

  constructor() {
    super();

    this.container = new PIXI.Container();
    this.wavesVector = new PIXI.Point();
    this.wavesSpeed = 0;

    const wavesTexture = PIXI.Texture.from(WAVES_SPRITES[WindDirection.NORTH]);
    this.wavesTilingSprite = new PIXI.TilingSprite(
      wavesTexture,
      MAP_GRID_WIDTH * MAP_GRID_CELL_SIZE,
      MAP_GRID_HEIGHT * MAP_GRID_CELL_SIZE
    );
    this.wavesTilingSprite.alpha = WAVES_SPRITE_OPACITY;

    this.container.addChild(this.wavesTilingSprite);
  }

  get renderObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
  }

  update(delta: number) {
    this.wavesTilingSprite.tilePosition.x += this.wavesVector.x * this.wavesSpeed;
    this.wavesTilingSprite.tilePosition.y += this.wavesVector.y * this.wavesSpeed;
  }

  setWavesSpeed(value: number) {
    this.wavesSpeed = value;
  }

  setWavesSpriteByWindDirection(windDirection: WindDirection) {
    const wavesTexture = PIXI.Texture.from(WAVES_SPRITES[windDirection]);
    this.wavesTilingSprite.texture = wavesTexture;
    this.wavesVector = mapWindDirectionToWavesVector(windDirection);
  }
}

export default Waves;
