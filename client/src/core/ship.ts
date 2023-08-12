import * as PIXI from "pixi.js";

import {
  MAP_GRID_CELL_SIZE,
  PLAYER_COLOR_SHIP_SPRITES,
  SHIP_MAX_VELOCITY,
  SHIP_HEIGHT,
  SHIP_SELECTION_INDICATOR_COLOR,
  SHIP_WIDTH,
} from "../utils/constants";
import { degreesToRadians, distanceBetweenPoints, rangeLerp } from "../utils/helpers";
import CameraState from "./camera-state";
import GameObject from "../models/game-object";
import PlayerColor from "../models/player-color";
import FlowField from "./flow-field";

class Ship implements GameObject {
  private container: PIXI.Container;
  private sprite: PIXI.Sprite;
  private velocity: PIXI.Point;
  private destination: PIXI.Point;
  private flowField: FlowField;
  private isMoving: boolean;
  private selectionIndicator: PIXI.Graphics;

  constructor(playerColor: PlayerColor) {
    // TODO: Fix container position?
    this.container = new PIXI.Container();
    this.selectionIndicator = new PIXI.Graphics();
    this.selectionIndicator.visible = false;

    const shipTexture = PIXI.Texture.from(PLAYER_COLOR_SHIP_SPRITES[playerColor]);

    this.sprite = PIXI.Sprite.from(shipTexture);
    this.sprite.width = SHIP_WIDTH;
    this.sprite.height = SHIP_HEIGHT;
    this.sprite.anchor.set(0.5, 0.5);

    this.container.addChild(this.sprite);
    this.container.addChild(this.selectionIndicator);
    this.container.eventMode = "static";

    this.velocity = new PIXI.Point(0, 0);
  }

  get displayObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
  }
  set transform(t: PIXI.Transform) {
    this.container.transform.position.set(t.position.x, t.position.y);
    this.container.transform.rotation = t.rotation;
  }

  setSelected(isSelected: boolean) {
    !isSelected && this.selectionIndicator.clear();
    this.selectionIndicator.visible = isSelected;
  }

  followFlowField(flowField: FlowField): void {
    this.flowField = flowField;
    this.destination = this.flowField.getDestinationPosition();
    this.isMoving = true;
  }

  update(delta: number): void {
    if (this.isMoving) {
      // TODO: Improve stopping logic
      const distance = distanceBetweenPoints(this.container.position, this.destination);
      if (distance <= MAP_GRID_CELL_SIZE) {
        this.velocity = new PIXI.Point(0, 0);
        this.isMoving = false;
      }

      const cell = this.flowField.getCellAtPosition(this.container.x, this.container.y);

      // TODO: Probably shouldn't modify velocity directly like this
      if (this.velocity.x < SHIP_MAX_VELOCITY) {
        this.velocity.x += 0.01;
      }
      if (this.velocity.y < SHIP_MAX_VELOCITY) {
        this.velocity.y += 0.01;
      }

      const offsetX = cell.bestDirection.x * this.velocity.x * delta;
      const offsetY = cell.bestDirection.y * this.velocity.y * delta;
      const angle = Math.atan2(offsetY, offsetX);

      this.container.rotation = angle - degreesToRadians(90);
      this.container.x += offsetX;
      this.container.y += offsetY;
    }

    this.drawSelectionIndicator();
  }

  private drawSelectionIndicator() {
    if (!this.selectionIndicator.visible) {
      return;
    }

    const { x, y } = this.sprite;
    const circleBorder = 4 + 8 * Math.abs(CameraState.zoomLevel - 1);
    const circlePadding = 10;
    const circleFillOpacity = rangeLerp(CameraState.zoomLevel, 0.25, 1, 0.35, 0.05);

    this.selectionIndicator.clear();
    this.selectionIndicator.lineStyle(circleBorder, SHIP_SELECTION_INDICATOR_COLOR, 0.75);
    this.selectionIndicator.beginFill(SHIP_SELECTION_INDICATOR_COLOR, circleFillOpacity);
    this.selectionIndicator.drawCircle(x, y, this.displayObject.height / 2 + circlePadding);
    this.selectionIndicator.endFill();
  }
}

export default Ship;
