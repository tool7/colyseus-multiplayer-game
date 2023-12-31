import * as PIXI from "pixi.js";

import Cell from "../models/cell";
import GridDirection from "../models/grid-direction";
import { WorldConfig } from "../models/world-config";
import Queue from "../utils/queue";
import { transformPolygonToWorldCoords } from "../utils/helpers";
import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";

class FlowField {
  private cellCountX: number;
  private cellCountY: number;
  private destination: Cell;
  cells: Cell[][];

  constructor(private worldConfig: WorldConfig, destinationCellI: number, destinationCellJ: number) {
    this.cellCountX = MAP_GRID_WIDTH;
    this.cellCountY = MAP_GRID_HEIGHT;
    this.cells = Array.from({ length: this.cellCountX }, () => Array.from({ length: this.cellCountY }));

    for (let i = 0; i < this.cellCountX; i++) {
      this.cells[i] = [];

      for (let j = 0; j < this.cellCountY; j++) {
        const x = i * MAP_GRID_CELL_SIZE + MAP_GRID_CELL_SIZE / 2;
        const y = j * MAP_GRID_CELL_SIZE + MAP_GRID_CELL_SIZE / 2;

        this.cells[i][j] = {
          i,
          j,
          position: new PIXI.Point(x, y),
          cost: 1,
          bestCost: 255,
          bestDirection: new PIXI.Point(0, 0),
        };
      }
    }

    this.destination = this.cells[destinationCellI][destinationCellJ];

    this.createCostField();
    this.createIntegrationField();
    this.createVectorField();
  }

  getCellAtPosition(x: number, y: number): Cell {
    const i = Math.floor(x / MAP_GRID_CELL_SIZE);
    const j = Math.floor(y / MAP_GRID_CELL_SIZE);
    return this.cells[i][j];
  }

  getDestinationPosition(): PIXI.Point {
    return this.destination.position;
  }

  private createCostField() {
    for (let i = 0; i < this.cellCountX; i++) {
      for (let j = 0; j < this.cellCountY; j++) {
        const cell = this.cells[i][j];

        const isIslandCell = this.worldConfig.islands.some(
          ({ collider, spriteWidth, spriteHeight, position, scaleFactor, rotation }) => {
            const absoluteIslandCollider = transformPolygonToWorldCoords(
              collider,
              spriteWidth,
              spriteHeight,
              position.x,
              position.y,
              scaleFactor,
              rotation
            );
            return absoluteIslandCollider.contains(cell.position.x, cell.position.y);
          }
        );
        const isStormCell = this.worldConfig.storms.some(
          ({ collider, spriteWidth, spriteHeight, position, scaleFactor }) => {
            const absoluteStormCollider = transformPolygonToWorldCoords(
              collider,
              spriteWidth,
              spriteHeight,
              position.x,
              position.y,
              scaleFactor
            );
            return absoluteStormCollider.contains(cell.position.x, cell.position.y);
          }
        );

        if (isIslandCell) {
          this.increaseCellCost(cell, 255);
          continue;
        }
        if (isStormCell) {
          this.increaseCellCost(cell, 3);
        }
      }
    }
  }

  private createIntegrationField() {
    this.destination.cost = 0;
    this.destination.bestCost = 0;

    const cellsToCheck = new Queue<Cell>();
    cellsToCheck.enqueue(this.destination);

    while (!cellsToCheck.isEmpty()) {
      const currentCell = cellsToCheck.dequeue();
      const neighborCells = this.getNeighborCells(currentCell, GridDirection.CARDINAL_DIRECTIONS);

      neighborCells.forEach((neighbor) => {
        if (neighbor.cost === 255) {
          return;
        }
        if (neighbor.cost + currentCell.bestCost < neighbor.bestCost) {
          neighbor.bestCost = neighbor.cost + currentCell.bestCost;
          cellsToCheck.enqueue(neighbor);
        }
      });
    }
  }

  private createVectorField() {
    for (let i = 0; i < this.cellCountX; i++) {
      for (let j = 0; j < this.cellCountY; j++) {
        const currentCell = this.cells[i][j];
        const neighborCells = this.getNeighborCells(currentCell, GridDirection.ALL_DIRECTIONS);

        let currentBestCost = currentCell.bestCost;

        neighborCells.forEach((neighbor) => {
          if (neighbor.bestCost < currentBestCost) {
            currentBestCost = neighbor.bestCost;
            currentCell.bestDirection.set(neighbor.i - currentCell.i, neighbor.j - currentCell.j);
          }
        });
      }
    }
  }

  private increaseCellCost(cell: Cell, amount: number) {
    if (cell.cost === 255) {
      return;
    }
    if (cell.cost + amount >= 255) {
      cell.cost = 255;
    } else {
      cell.cost += amount;
    }
  }

  private getNeighborCells(cell: Cell, gridDirections: GridDirection[]) {
    let neighborCells: Cell[] = [];

    gridDirections.forEach(({ vector }) => {
      if (this.isCellInBounds(cell.i + vector.x, cell.j + vector.y)) {
        neighborCells.push(this.cells[cell.i + vector.x][cell.j + vector.y]);
      }
    });

    return neighborCells;
  }

  private isCellInBounds(i: number, j: number): boolean {
    return i >= 0 && i < this.cellCountX && j >= 0 && j < this.cellCountY;
  }
}

export default FlowField;
