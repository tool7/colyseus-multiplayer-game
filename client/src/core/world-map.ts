import * as PIXI from "pixi.js";

import seaSpriteBase64 from "../assets/sea.png";
import Cell from "../models/cell";
import GameObject from "../models/game-object";
import MapConfiguration from "../models/map-configuration";
import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";
import FlowField from "./flow-field";
import { rangeLerp, rgbToHex } from "../utils/helpers";
import DebugController from "../utils/debug-controller";

class WorldMap implements GameObject {
  private container: PIXI.Container;
  private flowField: FlowField;
  private debugFlowFieldGrid: PIXI.Graphics;
  private debugFlowFieldVectors: PIXI.Graphics;
  private debugFlowFieldTextContainer: PIXI.Container;
  private debugFlowFieldType: string;

  constructor(private world: PIXI.Container, private mapConfiguration: MapConfiguration) {
    this.container = new PIXI.Container();
    this.drawMap();
    this.flowField = new FlowField(this.mapConfiguration);

    this.debugFlowFieldGrid = new PIXI.Graphics();
    this.debugFlowFieldVectors = new PIXI.Graphics();
    this.debugFlowFieldTextContainer = new PIXI.Container();

    DebugController.onChange("flowFieldType", (value: string) => {
      this.debugFlowFieldType = value;
    });
  }

  get displayObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
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

    this.world.addChild(background);
    this.world.addChild(islandGaphics);
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
        this.debugFlowFieldGrid.lineStyle(2, 0x000000, 0.1);
        this.debugFlowFieldGrid.beginFill(0x000000, 0);
        this.debugFlowFieldGrid.drawRect(
          position.x - MAP_GRID_CELL_SIZE / 2,
          position.y - MAP_GRID_CELL_SIZE / 2,
          MAP_GRID_CELL_SIZE,
          MAP_GRID_CELL_SIZE
        );
        this.debugFlowFieldGrid.endFill();

        if (this.debugFlowFieldType === "cost" || this.debugFlowFieldType === "integration") {
          const lerpedBestCost = Math.round(rangeLerp(bestCost, 0, 50, 0, 255));
          const textStyle = new PIXI.TextStyle({
            fill: rgbToHex(0, 200 - lerpedBestCost, 0),
            fontWeight: "bold",
          });
          const text = new PIXI.Text(this.debugFlowFieldType === "cost" ? cost : bestCost, textStyle);
          text.anchor.set(0.5, 0.5);
          text.position.set(position.x, position.y);
          this.debugFlowFieldTextContainer.addChild(text);
        }

        if (this.debugFlowFieldType === "flow") {
          const arrowX = position.x;
          const arrowY = position.y;
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
