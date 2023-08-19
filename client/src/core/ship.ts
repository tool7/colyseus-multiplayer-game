import * as PIXI from "pixi.js";

import {
  MAP_GRID_CELL_SIZE,
  PLAYER_COLOR_SHIP_SPRITES,
  SHIP_MAX_VELOCITY,
  SHIP_HEIGHT,
  SHIP_SELECTION_INDICATOR_COLOR,
  SHIP_WIDTH,
  SHIP_TURN_SPEED,
} from "../utils/constants";
import { distanceBetweenPoints, normalizeAngle, rangeLerp } from "../utils/helpers";
import CameraState from "./camera-state";
import GameObject from "../models/game-object";
import PlayerColor from "../models/player-color";
import FlowField from "./flow-field";

class Ship implements GameObject {
  flowField: FlowField;

  private container: PIXI.Container;
  private sprite: PIXI.Sprite;
  private velocity: number;
  private destination: PIXI.Point;
  private isMoving: boolean;
  private isDestinationReached: boolean;
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

    this.velocity = 0;
    this.isMoving = false;
    this.isDestinationReached = false;
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
    this.isDestinationReached = false;
    this.isMoving = true;
  }

  update(delta: number): void {
    this.drawSelectionIndicator();

    if (!this.isMoving) {
      return;
    }

    if (this.isDestinationReached) {
      this.velocity -= 0.01;

      if (Math.abs(this.velocity) < 0.01) {
        this.velocity = 0;
        this.isMoving = false;
      }
    } else {
      const distance = distanceBetweenPoints(this.container.position, this.destination);
      this.isDestinationReached = distance <= MAP_GRID_CELL_SIZE;

      // Gradually accelerating the ship up to the maximum velocity
      if (this.velocity < SHIP_MAX_VELOCITY) {
        this.velocity += 0.01;
      }

      // Calculating the desired angle based on the flow field's direction
      const { bestDirection } = this.flowField.getCellAtPosition(this.container.x, this.container.y);
      const desiredAngle = Math.atan2(bestDirection.y, bestDirection.x);

      // Gradually adjusting the ship's rotation to the desired angle
      const angleDifference = normalizeAngle(desiredAngle - this.container.rotation);
      const rotationSpeed = SHIP_TURN_SPEED * delta;
      if (Math.abs(angleDifference) > rotationSpeed) {
        const rotationDirection = angleDifference > 0 ? 1 : -1;
        this.container.rotation += rotationSpeed * rotationDirection;
      } else {
        this.container.rotation = desiredAngle;
      }
    }

    // Calculating forward vector of the ship based on its rotation
    const forwardX = Math.cos(this.container.rotation);
    const forwardY = Math.sin(this.container.rotation);

    // Moving the ship in its forward vector direction
    this.container.x += forwardX * this.velocity * delta;
    this.container.y += forwardY * this.velocity * delta;
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
    this.selectionIndicator.drawCircle(x, y, this.displayObject.width / 2 + circlePadding);
    this.selectionIndicator.endFill();
  }
}

export default Ship;
