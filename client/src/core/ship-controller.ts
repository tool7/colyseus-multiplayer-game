import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";
import { rangeLerp, rgbToHex } from "../utils/helpers";
import DebugController from "../utils/debug-controller";
import GameObject from "../models/game-object";
import WorldConfig from "../models/world-config";
import Ship from "./ship";
import FlowFieldGenerator from "./flow-field-generator";
import MouseAreaSelection from "./mouse-area-selection";

class ShipController extends GameObject {
  mouseAreaSelection: MouseAreaSelection;

  private selectedShips: Ship[];
  private container: PIXI.Container;
  private destinationSpriteTexture: PIXI.Texture;
  private destinationSpriteContainer: PIXI.Container;
  private destinationLineIndicators: PIXI.Graphics;

  private debugFlowFieldGrid: PIXI.Graphics;
  private debugFlowFieldVectors: PIXI.Graphics;
  private debugFlowFieldTextContainer: PIXI.Container;
  private debugFlowFieldType: string;

  constructor(viewport: Viewport, private worldConfig: WorldConfig, private playerShips: Ship[]) {
    super();

    this.selectedShips = [];
    this.mouseAreaSelection = new MouseAreaSelection(viewport);

    playerShips.forEach((ship) => {
      const otherShips = playerShips.filter((s) => s.id !== ship.id);
      ship.setOtherShips(otherShips);

      ship.renderObject.on("click", () => {
        this.selectedShips.forEach((ship) => ship.setSelected(false));
        ship.setSelected(true);
        this.selectedShips = [ship];

        this.drawDebugFlowFieldGrid();
      });
    });

    this.mouseAreaSelection.selectionEvent.on("select", (area: PIXI.Rectangle) => {
      this.selectedShips.forEach((ship) => ship.setSelected(false));
      this.selectedShips = this.playerShips.filter((ship) => {
        const global = ship.renderObject.toGlobal(new PIXI.Point(0, 0));
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

      this.setDestination(x, y, e.shiftKey);
      this.drawDebugFlowFieldGrid();
    });

    this.destinationSpriteTexture = PIXI.Texture.from("dist/assets/destination-indicator.png");
    this.destinationSpriteContainer = new PIXI.Container();
    this.destinationLineIndicators = new PIXI.Graphics();

    this.container = new PIXI.Container();
    this.container.addChild(this.destinationSpriteContainer);
    this.container.addChild(this.destinationLineIndicators);

    this.debugFlowFieldGrid = new PIXI.Graphics();
    this.debugFlowFieldVectors = new PIXI.Graphics();
    this.debugFlowFieldTextContainer = new PIXI.Container();

    DebugController.onChange("flowFieldType", (value: string) => {
      this.debugFlowFieldType = value;
    });
  }

  get renderObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
  }

  update() {
    this.updateDestinationIndicators();
  }

  private setDestination(x: number, y: number, append: boolean) {
    if (this.selectedShips.length === 0) {
      return;
    }

    const flowFieldGenerator = new FlowFieldGenerator(this.worldConfig);
    const flowFields = flowFieldGenerator.generateMultipleFlowFields(x, y, this.selectedShips.length, 1);

    this.selectedShips.forEach((ship, i) => {
      ship.setFlowField(flowFields[i], !append);
    });
  }

  private updateDestinationIndicators() {
    this.destinationSpriteContainer.removeChildren();
    this.destinationLineIndicators.clear();

    if (this.selectedShips.length === 0) {
      return;
    }

    const addSpriteToContainer = ({ x, y }: PIXI.Point) => {
      const sprite = PIXI.Sprite.from(this.destinationSpriteTexture);
      sprite.position.set(x, y);
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(0.8);
      this.destinationSpriteContainer.addChild(sprite);
    };

    this.selectedShips.forEach((ship) => {
      if (ship.flowFieldQueue.elements.length === 0) {
        return;
      }
      this.destinationLineIndicators.moveTo(ship.renderObject.x, ship.renderObject.y);
      this.destinationLineIndicators.lineStyle(1, 0x000000, 0.5);

      const destinations = ship.flowFieldQueue.elements.map((flowField) => flowField.getDestinationPosition());
      destinations.forEach((dest) => {
        addSpriteToContainer(dest);
        this.destinationLineIndicators.lineTo(dest.x, dest.y);
      });
    });
  }

  private drawDebugFlowFieldGrid() {
    if (this.selectedShips.length !== 1 || !this.selectedShips[0].flowFieldQueue.peak() || !this.debugFlowFieldType) {
      this.container.removeChild(this.debugFlowFieldGrid);
      this.container.removeChild(this.debugFlowFieldVectors);
      this.container.removeChild(this.debugFlowFieldTextContainer);
      return;
    }

    this.container.addChild(this.debugFlowFieldGrid);
    this.container.addChild(this.debugFlowFieldVectors);
    this.container.addChild(this.debugFlowFieldTextContainer);
    this.debugFlowFieldGrid.clear();
    this.debugFlowFieldTextContainer.removeChildren();
    this.debugFlowFieldVectors.clear();

    const { cells } = this.selectedShips[0].flowFieldQueue.peak();

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
          this.debugFlowFieldVectors.lineTo(arrowX + bestDirection.x * 15, arrowY + bestDirection.y * 15);
          this.debugFlowFieldVectors.drawCircle(arrowX, arrowY, 3);
        }
      }
    }
  }
}

export default ShipController;
