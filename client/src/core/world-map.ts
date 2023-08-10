import * as PIXI from "pixi.js";
import { Tilemap } from "@pixi/tilemap";

import seaTileBase64 from "../assets/sea_tile.png";
import Cell from "../models/cell";
import GameObject from "../models/game-object";
import { MAP_HEIGHT, MAP_WIDTH } from "../utils/constants";
import FlowField from "./flow-field";
import { rangeLerp, rgbToHex } from "../utils/helpers";
import DebugController from "../utils/debug-controller";

class WorldMap implements GameObject {
  private flowField: FlowField;
  private tileCountX: number;
  private tileCountY: number;
  private tileSize: number;
  private tilemap: Tilemap;
  private debugFlowFieldGrid: PIXI.Graphics;
  private debugFlowFieldVectors: PIXI.Graphics;
  private debugFlowFieldTextContainer: PIXI.Container;
  private debugFlowFieldType: string;

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

    this.debugFlowFieldGrid = new PIXI.Graphics();
    this.debugFlowFieldVectors = new PIXI.Graphics();
    this.debugFlowFieldTextContainer = new PIXI.Container();

    DebugController.onChange("flowFieldType", (value: string) => {
      this.debugFlowFieldType = value;
    });
  }

  get displayObject() {
    return this.tilemap;
  }
  get transform() {
    return this.tilemap.transform;
  }
  update(delta: number): void {}

  initializeFlowFieldAt(x: number, y: number) {
    this.flowField.init();

    const destinationCell = this.flowField.getCellAtPosition(x, y);
    this.flowField.createCostField();
    this.flowField.createIntegrationField(destinationCell);
    this.flowField.createFlowField();

    this.drawDebugFlowFieldGrid(this.flowField.cells);
  }

  private drawDebugFlowFieldGrid(cells: Cell[][]) {
    if (!this.debugFlowFieldType) {
      this.world.removeChild(this.debugFlowFieldGrid);
      this.world.removeChild(this.debugFlowFieldVectors);
      this.world.removeChild(this.debugFlowFieldTextContainer);
      return;
    }

    this.world.addChild(this.debugFlowFieldGrid);
    this.world.addChild(this.debugFlowFieldVectors);
    this.world.addChild(this.debugFlowFieldTextContainer);
    this.debugFlowFieldGrid.clear();
    this.debugFlowFieldTextContainer.removeChildren();
    this.debugFlowFieldVectors.clear();

    for (let i = 0; i < this.tileCountX; i++) {
      for (let j = 0; j < this.tileCountY; j++) {
        const { position, cost, bestCost, bestDirection } = cells[i][j];
        this.debugFlowFieldGrid.lineStyle(2, 0x000000, 0.3);
        this.debugFlowFieldGrid.beginFill(0x000000, 0);
        this.debugFlowFieldGrid.drawRect(position.x, position.y, this.tileSize, this.tileSize);
        this.debugFlowFieldGrid.endFill();

        if (this.debugFlowFieldType === "cost" || this.debugFlowFieldType === "integration") {
          const lerpedBestCost = Math.round(rangeLerp(bestCost, 0, 50, 0, 255));
          const textStyle = new PIXI.TextStyle({
            fill: rgbToHex(0, 200 - lerpedBestCost, 0),
            fontWeight: "bold",
          });
          const text = new PIXI.Text(this.debugFlowFieldType === "cost" ? cost : bestCost, textStyle);
          text.anchor.set(0.5, 0.5);
          text.position.set(position.x + this.tileSize / 2, position.y + this.tileSize / 2);
          this.debugFlowFieldTextContainer.addChild(text);
        }

        if (this.debugFlowFieldType === "flow") {
          const arrowX = position.x + this.tileSize / 2;
          const arrowY = position.y + this.tileSize / 2;
          this.debugFlowFieldVectors.moveTo(arrowX, arrowY);
          this.debugFlowFieldVectors.lineStyle(3, 0x000000, 0.5);
          this.debugFlowFieldVectors.beginFill(0x000000, 1);
          this.debugFlowFieldVectors.lineTo(arrowX + bestDirection.x * 15, arrowY + bestDirection.y * 15);
          this.debugFlowFieldVectors.drawCircle(arrowX, arrowY, 3);
        }
      }
    }
  }
}

export default WorldMap;
