import * as PIXI from "pixi.js";
import { Tilemap } from "@pixi/tilemap";

import seaTileBase64 from "../assets/sea_tile.png";
import Tile from "../models/tile";
import GameObject from "../models/game-object";
import { DEBUG_FLOW_FIELD_GRID_ENABLED, MAP_HEIGHT, MAP_WIDTH } from "../utils/constants";

class WorldMap implements GameObject {
  private tiles: Tile[][];
  private horizontalCount: number;
  private verticalCount: number;
  private tileSize: number;
  private tilemap: Tilemap;
  private debugFlowFieldGrid: PIXI.Graphics;

  constructor(private world: PIXI.Container) {
    const seaTile = PIXI.Texture.from(seaTileBase64);

    this.tileSize = seaTile.width;
    this.horizontalCount = Math.round(MAP_WIDTH / this.tileSize);
    this.verticalCount = Math.round(MAP_HEIGHT / this.tileSize);
    this.tiles = Array.from({ length: this.horizontalCount }, () => Array.from({ length: this.verticalCount }));
    this.tilemap = new Tilemap([seaTile.baseTexture]);

    this.world.addChild(this.tilemap);

    for (let i = 0; i < this.horizontalCount; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.verticalCount; j++) {
        this.tiles[i][j] = { i, j, cost: 1 };
        this.tilemap.tile(seaTile, i * this.tileSize, j * this.tileSize);
      }
    }

    if (DEBUG_FLOW_FIELD_GRID_ENABLED) {
      this.drawDebugFlowFieldGrid();
    }
  }

  private isTileInBounds(i: number, j: number): boolean {
    return i >= 0 && i < this.horizontalCount && j >= 0 && j < this.verticalCount;
  }

  getTileAtPosition(x: number, y: number): Tile {
    const i = Math.floor(x / this.tileSize);
    const j = Math.floor(y / this.tileSize);
    return this.tiles[i][j];
  }

  getTileNeighbors(tile: Tile) {
    let result: Tile[] = [];

    if (this.isTileInBounds(tile.i - 1, tile.j)) {
      result.push(this.tiles[tile.i - 1][tile.j]);
    }
    if (this.isTileInBounds(tile.i, tile.j + 1)) {
      result.push(this.tiles[tile.i][tile.j + 1]);
    }
    if (this.isTileInBounds(tile.i + 1, tile.j)) {
      result.push(this.tiles[tile.i + 1][tile.j]);
    }
    if (this.isTileInBounds(tile.i, tile.j - 1)) {
      result.push(this.tiles[tile.i][tile.j - 1]);
    }
    return result;
  }

  get displayObject() {
    return this.tilemap;
  }
  get transform() {
    return this.tilemap.transform;
  }

  update(delta: number): void {}

  private drawDebugFlowFieldGrid() {
    this.debugFlowFieldGrid = new PIXI.Graphics();

    for (let i = 0; i < this.horizontalCount; i++) {
      for (let j = 0; j < this.verticalCount; j++) {
        const x = i * this.tileSize;
        const y = j * this.tileSize;
        this.debugFlowFieldGrid.lineStyle(2, 0x000000, 0.3);
        this.debugFlowFieldGrid.beginFill(0x000000, 0);
        this.debugFlowFieldGrid.drawRect(x, y, this.tileSize, this.tileSize);
        this.debugFlowFieldGrid.endFill();

        const text = new PIXI.Text(this.tiles[i][j].cost);
        text.anchor.set(0.5, 0.5);
        text.position.set(x + this.tileSize / 2, y + this.tileSize / 2);
        this.world.addChild(text);
      }
    }

    this.world.addChild(this.debugFlowFieldGrid);
  }
}

export default WorldMap;
