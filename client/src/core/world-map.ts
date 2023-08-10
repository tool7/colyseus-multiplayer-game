import * as PIXI from "pixi.js";

import seaSpriteBase64 from "../assets/sea.png";
import Cell from "../models/cell";
import GameObject from "../models/game-object";
import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";
import FlowField from "./flow-field";
import { rangeLerp, rgbToHex } from "../utils/helpers";
import DebugController from "../utils/debug-controller";

class WorldMap implements GameObject {
  private background: PIXI.Sprite;
  private flowField: FlowField;
  private debugFlowFieldGrid: PIXI.Graphics;
  private debugFlowFieldVectors: PIXI.Graphics;
  private debugFlowFieldTextContainer: PIXI.Container;
  private debugFlowFieldType: string;

  constructor(private world: PIXI.Container) {
    const seaTexture = PIXI.Texture.from(seaSpriteBase64);
    this.background = PIXI.Sprite.from(seaTexture);
    this.background.width = MAP_GRID_WIDTH * MAP_GRID_CELL_SIZE;
    this.background.height = MAP_GRID_HEIGHT * MAP_GRID_CELL_SIZE;
    this.world.addChild(this.background);

    this.flowField = new FlowField();

    this.debugFlowFieldGrid = new PIXI.Graphics();
    this.debugFlowFieldVectors = new PIXI.Graphics();
    this.debugFlowFieldTextContainer = new PIXI.Container();

    DebugController.onChange("flowFieldType", (value: string) => {
      this.debugFlowFieldType = value;
    });
  }

  get displayObject() {
    return this.background;
  }
  get transform() {
    return this.background.transform;
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

    for (let i = 0; i < MAP_GRID_WIDTH; i++) {
      for (let j = 0; j < MAP_GRID_HEIGHT; j++) {
        const { position, cost, bestCost, bestDirection } = cells[i][j];
        this.debugFlowFieldGrid.lineStyle(2, 0x000000, 0.3);
        this.debugFlowFieldGrid.beginFill(0x000000, 0);
        this.debugFlowFieldGrid.drawRect(position.x, position.y, MAP_GRID_CELL_SIZE, MAP_GRID_CELL_SIZE);
        this.debugFlowFieldGrid.endFill();

        if (this.debugFlowFieldType === "cost" || this.debugFlowFieldType === "integration") {
          const lerpedBestCost = Math.round(rangeLerp(bestCost, 0, 50, 0, 255));
          const textStyle = new PIXI.TextStyle({
            fill: rgbToHex(0, 200 - lerpedBestCost, 0),
            fontWeight: "bold",
          });
          const text = new PIXI.Text(this.debugFlowFieldType === "cost" ? cost : bestCost, textStyle);
          text.anchor.set(0.5, 0.5);
          text.position.set(position.x + MAP_GRID_CELL_SIZE / 2, position.y + MAP_GRID_CELL_SIZE / 2);
          this.debugFlowFieldTextContainer.addChild(text);
        }

        if (this.debugFlowFieldType === "flow") {
          const arrowX = position.x + MAP_GRID_CELL_SIZE / 2;
          const arrowY = position.y + MAP_GRID_CELL_SIZE / 2;
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
