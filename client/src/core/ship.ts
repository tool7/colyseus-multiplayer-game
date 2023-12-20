import * as PIXI from "pixi.js";

import {
  MAP_GRID_CELL_SIZE,
  PLAYER_COLOR_SHIP_SPRITES,
  SHIP_MAX_VELOCITY,
  SHIP_HEIGHT,
  SHIP_WIDTH,
  SHIP_TURN_SPEED,
  SHIP_NEIGHBORHOOD_RADIUS,
  SHIP_REPULSION_FORCE,
} from "../utils/constants";
import {
  distanceBetweenPoints,
  getVectorBetweenPoints,
  normalizeAngle,
  normalizeVector,
  rangeLerp,
} from "../utils/helpers";
import Queue from "../utils/queue";
import GameObject from "../models/game-object";
import PlayerColor from "../models/player-color";
import FlowField from "./flow-field";
import Camera from "./camera";

class Ship extends GameObject {
  flowFieldQueue: Queue<FlowField>;

  private container: PIXI.Container;
  private sprite: PIXI.Sprite;
  private velocity: number;
  private isMoving: boolean;
  private isDestinationReached: boolean;
  private selectionIndicator: PIXI.Graphics;
  private otherShips: Ship[];

  constructor(private playerColor: PlayerColor) {
    super();

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
    this.flowFieldQueue = new Queue<FlowField>();
    this.isMoving = false;
    this.isDestinationReached = false;

    Camera.events.on("zoom-change", () => this.drawSelectionIndicator());
  }

  get renderObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
  }
  set transform(t: PIXI.Transform) {
    this.container.transform.position.set(t.position.x, t.position.y);
    this.container.transform.rotation = t.rotation;
  }

  setOtherShips(ships: Ship[]): void {
    this.otherShips = ships;
  }

  setSelected(isSelected: boolean) {
    !isSelected && this.selectionIndicator.clear();
    this.selectionIndicator.visible = isSelected;
    this.drawSelectionIndicator();
  }

  setFlowField(flowField: FlowField, isNewRoute: boolean): void {
    isNewRoute && this.flowFieldQueue.clear();
    this.flowFieldQueue.enqueue(flowField);

    if (!this.isMoving || isNewRoute) {
      this.isDestinationReached = false;
      this.isMoving = true;
    }
  }

  update(delta: number) {
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
      let currentFlowField = this.flowFieldQueue.peak();

      const destination = currentFlowField.getDestinationPosition();
      const distance = distanceBetweenPoints(this.container.position, destination);

      if (distance <= MAP_GRID_CELL_SIZE) {
        this.flowFieldQueue.dequeue();

        currentFlowField = this.flowFieldQueue.peak();
        if (!currentFlowField) {
          this.isDestinationReached = true;
        }
      }

      // Gradually accelerating the ship up to the maximum velocity
      if (this.velocity < SHIP_MAX_VELOCITY) {
        this.velocity += 0.01;
      }

      // Calculating the desired angle based on the flow field's direction
      const direction = currentFlowField
        ? currentFlowField.getCellAtPosition(this.container.x, this.container.y).bestDirection
        : new PIXI.Point();
      const desiredAngle = Math.atan2(direction.y, direction.x);

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

    // Collision avoidance
    const repulsionVector = this.getNeighborShipsRepulsionVector();

    // Calculating forward vector of the ship based on its rotation
    const forwardX = Math.cos(this.container.rotation) + repulsionVector.x;
    const forwardY = Math.sin(this.container.rotation) + repulsionVector.y;

    // Moving the ship in its forward vector direction
    this.container.x += forwardX * this.velocity * delta;
    this.container.y += forwardY * this.velocity * delta;
  }

  private getNeighborShipsRepulsionVector(): PIXI.Point {
    const neighborShips = this.otherShips.filter((ship) => {
      const distance = distanceBetweenPoints(this.transform.position, ship.transform.position);
      return distance < SHIP_NEIGHBORHOOD_RADIUS;
    });

    return neighborShips.reduce((sum, ship) => {
      const distanceToNeighborShip = distanceBetweenPoints(this.transform.position, ship.transform.position);
      const vectorFromNeighborShip = getVectorBetweenPoints(ship.transform.position, this.transform.position);
      const normalizedVector = normalizeVector(vectorFromNeighborShip);
      sum.x += (normalizedVector.x / distanceToNeighborShip) * SHIP_REPULSION_FORCE;
      sum.y += (normalizedVector.y / distanceToNeighborShip) * SHIP_REPULSION_FORCE;
      return sum;
    }, new PIXI.Point(0, 0));
  }

  private drawSelectionIndicator() {
    if (!this.selectionIndicator.visible) {
      return;
    }

    const { x, y } = this.sprite;
    const circleBorder = 2 + 5 * Math.abs(Camera.zoomLevel - 1);
    const circlePadding = 6;
    const circleFillOpacity = rangeLerp(Camera.zoomLevel, 0.25, 1, 0.35, 0.05);

    const color = this.playerColor.toString();

    this.selectionIndicator.clear();
    this.selectionIndicator.lineStyle(circleBorder, color, 0.75);
    this.selectionIndicator.beginFill(color, circleFillOpacity);
    this.selectionIndicator.drawCircle(x, y, this.container.width / 2 + circlePadding);
    this.selectionIndicator.endFill();
  }
}

export default Ship;
