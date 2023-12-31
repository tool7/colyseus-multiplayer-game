import * as PIXI from "pixi.js";

import seaSpriteBase64 from "../assets/sea.png";
import GameObject from "../models/game-object";
import Waves from "./waves";
import { WorldConfig } from "../models/world-config";
import WindDirection from "../models/wind-direction";
import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";
import { transformPolygonToWorldCoords } from "../utils/helpers";
import DebugController from "../utils/debug-controller";

class WorldMap extends GameObject {
  private container: PIXI.Container;
  private waves: Waves;

  private showDebugColliders: boolean;
  private colliderDebugGraphics: PIXI.Graphics;

  constructor(private worldConfig: WorldConfig) {
    super();

    this.container = new PIXI.Container();
    this.waves = new Waves();
    this.drawMap();

    // TODO: Get "windDirection" and "windSpeed" from some kind of game state object
    const windDirection = WindDirection.NORTH_WEST;
    const windSpeed = 0.2;
    this.waves.setWavesSpeed(windSpeed);
    this.waves.setWavesSpriteByWindDirection(windDirection);

    this.colliderDebugGraphics = new PIXI.Graphics();
    DebugController.onChange("showColliders", (value: boolean) => {
      this.showDebugColliders = value;
      this.drawDebugColliders();
    });
  }

  get renderObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
  }

  update(delta: number) {
    this.waves.update(delta);
  }

  private drawMap() {
    const seaTexture = PIXI.Texture.from(seaSpriteBase64);
    const background = PIXI.Sprite.from(seaTexture);
    background.width = MAP_GRID_WIDTH * MAP_GRID_CELL_SIZE;
    background.height = MAP_GRID_HEIGHT * MAP_GRID_CELL_SIZE;

    this.container.addChild(background);
    this.container.addChild(this.waves.renderObject);

    this.worldConfig.islands.forEach((island) => {
      const islandTexture = PIXI.Texture.from(island.spriteAssetPath);
      const islandSprite = PIXI.Sprite.from(islandTexture);
      islandSprite.anchor.set(0.5, 0.5);
      islandSprite.position.set(island.position.x, island.position.y);
      islandSprite.scale.set(island.scaleFactor);
      islandSprite.rotation = island.rotation;

      this.container.addChild(islandSprite);
    });

    this.worldConfig.storms.forEach((storm) => {});
  }

  private drawDebugColliders() {
    if (!this.showDebugColliders) {
      this.container.removeChild(this.colliderDebugGraphics);
      return;
    }

    this.container.addChild(this.colliderDebugGraphics);
    this.colliderDebugGraphics.clear();

    this.worldConfig.islands.forEach(
      ({ collider, highGroundColliders, spriteWidth, spriteHeight, position, scaleFactor, rotation }) => {
        const absoluteIslandCollider = transformPolygonToWorldCoords(
          collider,
          spriteWidth,
          spriteHeight,
          position.x,
          position.y,
          scaleFactor,
          rotation
        );
        this.colliderDebugGraphics.lineStyle(2, 0xff0000);
        this.colliderDebugGraphics.drawPolygon(absoluteIslandCollider);

        if (highGroundColliders) {
          highGroundColliders.forEach((highGroundCollider) => {
            const absoluteHighGroundCollider = transformPolygonToWorldCoords(
              highGroundCollider,
              spriteWidth,
              spriteHeight,
              position.x,
              position.y,
              scaleFactor,
              rotation
            );
            this.colliderDebugGraphics.lineStyle(2, 0x000000);
            this.colliderDebugGraphics.drawPolygon(absoluteHighGroundCollider);
          });
        }
      }
    );
  }
}

export default WorldMap;
