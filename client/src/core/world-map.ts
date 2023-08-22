import * as PIXI from "pixi.js";
import { nanoid } from "nanoid";

import seaSpriteBase64 from "../assets/sea.png";
import GameObject from "../models/game-object";
import MapConfiguration from "../models/map-configuration";
import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";

class WorldMap implements GameObject {
  id: string;

  private container: PIXI.Container;

  constructor(private mapConfiguration: MapConfiguration) {
    this.id = nanoid();

    this.container = new PIXI.Container();
    this.drawMap();
  }

  get displayObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
  }

  private drawMap() {
    const seaTexture = PIXI.Texture.from(seaSpriteBase64);
    const background = PIXI.Sprite.from(seaTexture);
    background.width = MAP_GRID_WIDTH * MAP_GRID_CELL_SIZE;
    background.height = MAP_GRID_HEIGHT * MAP_GRID_CELL_SIZE;

    const islandGaphics = new PIXI.Graphics();
    this.mapConfiguration.islands.forEach((island) => {
      islandGaphics.lineStyle(30, 0xad8124);
      islandGaphics.beginFill(0x1b611b, 1);
      islandGaphics.drawPolygon(island);
      islandGaphics.endFill();
    });

    const stormGraphics = new PIXI.Graphics();
    this.mapConfiguration.storms.forEach((storm) => {
      stormGraphics.lineStyle(0);
      stormGraphics.beginFill(0x4c9ded, 1);
      stormGraphics.drawPolygon(storm);
      stormGraphics.endFill();
    });

    this.container.addChild(background);
    this.container.addChild(islandGaphics);
    this.container.addChild(stormGraphics);
  }
}

export default WorldMap;
