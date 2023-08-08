import * as PIXI from "pixi.js";

class GridDirection {
  vector: PIXI.Point;

  constructor(vector: PIXI.Point) {
    this.vector = vector;
  }

  private static None = new GridDirection(new PIXI.Point(0, 0));
  private static North = new GridDirection(new PIXI.Point(0, -1));
  private static South = new GridDirection(new PIXI.Point(0, 1));
  private static East = new GridDirection(new PIXI.Point(1, 0));
  private static West = new GridDirection(new PIXI.Point(-1, 0));
  private static NorthEast = new GridDirection(new PIXI.Point(1, -1));
  private static NorthWest = new GridDirection(new PIXI.Point(-1, -1));
  private static SouthEast = new GridDirection(new PIXI.Point(1, 1));
  private static SouthWest = new GridDirection(new PIXI.Point(-1, 1));

  static CARDINAL_DIRECTIONS: GridDirection[] = [this.North, this.South, this.East, this.West];
  static ALL_DIRECTIONS: GridDirection[] = [
    this.None,
    this.North,
    this.South,
    this.East,
    this.West,
    this.NorthEast,
    this.NorthWest,
    this.SouthEast,
    this.SouthWest,
  ];
}

export default GridDirection;
