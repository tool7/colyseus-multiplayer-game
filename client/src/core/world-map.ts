import * as PIXI from "pixi.js";
import { Tilemap } from "@pixi/tilemap";

import seaTileBase64 from "../assets/sea_tile.png";
import Cell from "../models/cell";
import GameObject from "../models/game-object";
import { DEBUG_FLOW_FIELD_GRID_ENABLED, MAP_HEIGHT, MAP_WIDTH } from "../utils/constants";
import FlowField from "./flow-field";

class WorldMap implements GameObject {
  private flowField: FlowField;
  private tileCountX: number;
  private tileCountY: number;
  private tileSize: number;
  private tilemap: Tilemap;
  private debugFlowFieldGrid: PIXI.Graphics;

  constructor(private world: PIXI.Container) {
    // TODO: Fix issue with small tiles when importing Texture as path
    // const seaTile = PIXI.Texture.from("dist/assets/sea_tile.png");
    const seaTile = PIXI.Texture.from(seaTileBase64);
    this.tileSize = 64;
    this.tileCountX = Math.round(MAP_WIDTH / this.tileSize);
    this.tileCountY = Math.round(MAP_HEIGHT / this.tileSize);
    this.flowField = new FlowField(this.tileCountX, this.tileCountY, this.tileSize);
    this.tilemap = new Tilemap([seaTile.baseTexture]);

    this.world.addChild(this.tilemap);

    for (let i = 0; i < this.tileCountX; i++) {
      for (let j = 0; j < this.tileCountY; j++) {
        const x = i * this.tileSize;
        const y = j * this.tileSize;
        this.tilemap.tile(seaTile, x, y);
      }
    }
  }

  get displayObject() {
    return this.tilemap;
  }
  get transform() {
    return this.tilemap.transform;
  }
  update(delta: number): void {}

  initializeFlowFieldAt(x: number, y: number) {
    const destinationCell = this.flowField.getCellAtPosition(x, y);

    this.flowField.createCostField();
    this.flowField.createIntegrationField(destinationCell);
    // this.flowField.createFlowField();

    if (DEBUG_FLOW_FIELD_GRID_ENABLED) {
      this.drawDebugFlowFieldGrid(this.flowField.cells);
    }
  }

  private drawDebugFlowFieldGrid(cells: Cell[][]) {
    if (!this.debugFlowFieldGrid) {
      this.debugFlowFieldGrid = new PIXI.Graphics();
    }
    this.debugFlowFieldGrid.clear();

    for (let i = 0; i < this.tileCountX; i++) {
      for (let j = 0; j < this.tileCountY; j++) {
        const { position } = cells[i][j];
        this.debugFlowFieldGrid.lineStyle(2, 0x000000, 0.3);
        this.debugFlowFieldGrid.beginFill(0x000000, 0);
        this.debugFlowFieldGrid.drawRect(position.x, position.y, this.tileSize, this.tileSize);
        this.debugFlowFieldGrid.endFill();

        // const text = new PIXI.Text(cells[i][j].cost);
        const text = new PIXI.Text(cells[i][j].bestCost);
        text.anchor.set(0.5, 0.5);
        text.position.set(position.x + this.tileSize / 2, position.y + this.tileSize / 2);
        this.world.addChild(text);
      }
    }

    this.world.addChild(this.debugFlowFieldGrid);
  }
}

export default WorldMap;
