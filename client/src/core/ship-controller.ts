import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";
import { rangeLerp, rgbToHex } from "../utils/helpers";
import DebugController from "../utils/debug-controller";
import MapConfiguration from "../models/map-configuration";
import Cell from "../models/cell";
import Ship from "./ship";
import FlowField from "./flow-field";
import MouseAreaSelection from "./mouse-area-selection";

class ShipController {
  private selectedShips: Ship[];
  private mouseAreaSelection: MouseAreaSelection;
  private debugFlowFieldGrid: PIXI.Graphics;
  private debugFlowFieldVectors: PIXI.Graphics;
  private debugFlowFieldTextContainer: PIXI.Container;
  private debugFlowFieldType: string;

  constructor(private viewport: Viewport, private mapConfiguration: MapConfiguration, private playerShips: Ship[]) {
    this.selectedShips = [];
    this.mouseAreaSelection = new MouseAreaSelection(viewport);

    playerShips.forEach((ship) => {
      ship.displayObject.on("click", () => {
        this.selectedShips.forEach((ship) => ship.setSelected(false));
        ship.setSelected(true);
        this.selectedShips = [ship];

        this.drawDebugFlowFieldGrid();
      });
    });

    this.mouseAreaSelection.selectionEvent.on("select", (area: PIXI.Rectangle) => {
      this.selectedShips.forEach((ship) => ship.setSelected(false));
      this.selectedShips = this.playerShips.filter((ship) => {
        const global = ship.displayObject.toGlobal(new PIXI.Point(0, 0));
        return area.contains(global.x, global.y);
      });
      this.selectedShips.forEach((ship) => ship.setSelected(true));

      this.drawDebugFlowFieldGrid();
    });

    viewport.on("rightclick", (e) => {
      const { x, y } = e.getLocalPosition(viewport);
      if (x < 0 || x > viewport.worldWidth || y < 0 || y > viewport.worldHeight) {
        return;
      }

      const flowField = this.getFlowFieldForPosition(x, y);

      // TODO: Create flow field for each of the ships, with slightly different destinations
      this.selectedShips.forEach((ship) => {
        ship.followFlowField(flowField);
      });

      this.drawDebugFlowFieldGrid();
    });

    this.debugFlowFieldGrid = new PIXI.Graphics();
    this.debugFlowFieldVectors = new PIXI.Graphics();
    this.debugFlowFieldTextContainer = new PIXI.Container();

    DebugController.onChange("flowFieldType", (value: string) => {
      this.debugFlowFieldType = value;
    });
  }

  getDisplayObjects(): PIXI.DisplayObject[] {
    return [this.mouseAreaSelection.displayObject];
  }

  private getFlowFieldForPosition(x: number, y: number): FlowField {
    const flowField = new FlowField(this.mapConfiguration);
    flowField.init();

    const destinationCell = flowField.getCellAtPosition(x, y);
    flowField.createCostField();
    flowField.createIntegrationField(destinationCell);
    flowField.createFlowField();

    return flowField.clone();
  }

  private drawDebugFlowFieldGrid() {
    if (this.selectedShips.length !== 1 || !this.selectedShips[0].flowField || !this.debugFlowFieldType) {
      this.viewport.removeChild(this.debugFlowFieldGrid);
      this.viewport.removeChild(this.debugFlowFieldVectors);
      this.viewport.removeChild(this.debugFlowFieldTextContainer);
      return;
    }

    this.viewport.addChild(this.debugFlowFieldGrid);
    this.viewport.addChild(this.debugFlowFieldVectors);
    this.viewport.addChild(this.debugFlowFieldTextContainer);
    this.debugFlowFieldGrid.clear();
    this.debugFlowFieldTextContainer.removeChildren();
    this.debugFlowFieldVectors.clear();

    const { cells } = this.selectedShips[0].flowField;

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

export default ShipController;
