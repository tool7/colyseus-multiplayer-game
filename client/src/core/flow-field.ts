import * as PIXI from "pixi.js";

import Cell from "../models/cell";
import GridDirection from "../models/grid-direction";
import Queue from "../utils/queue";

class FlowField {
  cells: Cell[][];
  destination: Cell;

  constructor(private cellCountX: number, private cellCountY: number, private tileSize: number) {
    this.cells = Array.from({ length: this.cellCountX }, () => Array.from({ length: this.cellCountY }));
  }

  init() {
    for (let i = 0; i < this.cellCountX; i++) {
      this.cells[i] = [];

      for (let j = 0; j < this.cellCountY; j++) {
        const x = i * this.tileSize;
        const y = j * this.tileSize;
        this.cells[i][j] = {
          i,
          j,
          position: new PIXI.Point(x, y),
          cost: 1,
          bestCost: 255,
          bestDirection: new PIXI.Point(0, 0),
          isRoughSea: false,
          isObstacle: false,
        };

        // TODO: Testing purposes
        if (i > 20 && i < 25 && j > 10 && j < 20) {
          this.cells[i][j].isRoughSea = true;
        }
        if (i > 10 && i < 15 && j > 2 && j < 6) {
          this.cells[i][j].isObstacle = true;
        }
      }
    }
  }

  createCostField() {
    for (let i = 0; i < this.cellCountX; i++) {
      for (let j = 0; j < this.cellCountY; j++) {
        const cell = this.cells[i][j];

        if (cell.isObstacle) {
          this.increaseCellCost(cell, 255);
          continue;
        }
        if (cell.isRoughSea) {
          this.increaseCellCost(cell, 3);
        }
      }
    }
  }

  createIntegrationField(destinationCell: Cell) {
    // TODO: Is "this.destination" property needed?
    this.destination = destinationCell;
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

  createFlowField() {
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

  getCellAtPosition(x: number, y: number): Cell {
    const i = Math.floor(x / this.tileSize);
    const j = Math.floor(y / this.tileSize);
    return this.cells[i][j];
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
