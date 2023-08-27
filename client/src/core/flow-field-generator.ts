import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";
import WorldConfig from "../models/world-config";
import FlowField from "./flow-field";

class FlowFieldGenerator {
  constructor(private worldConfig: WorldConfig) {}

  generateMultipleFlowFields(x: number, y: number, count: number, separationDistance: number): FlowField[] {
    const targetCellI = Math.floor(x / MAP_GRID_CELL_SIZE);
    const targetCellJ = Math.floor(y / MAP_GRID_CELL_SIZE);
    const destinations: { i: number; j: number }[] = count === 1 ? [{ i: targetCellI, j: targetCellJ }] : [];

    for (let radius = 1; destinations.length < count; radius++) {
      for (let angle = 0; angle < 360; angle += 360 / (radius * 6)) {
        const iOffset = Math.round(radius * Math.cos(angle));
        const jOffset = Math.round(radius * Math.sin(angle));
        const destI = targetCellI + iOffset;
        const destJ = targetCellJ + jOffset;

        if (destI >= 0 && destI < MAP_GRID_WIDTH && destJ >= 0 && destJ < MAP_GRID_HEIGHT) {
          const isSeparated = destinations.every(
            (dest) => Math.abs(dest.i - destI) >= separationDistance && Math.abs(dest.j - destJ) >= separationDistance
          );
          if (isSeparated) {
            destinations.push({ i: destI, j: destJ });
          }
        }
      }
    }

    return destinations.map((dest) => new FlowField(this.worldConfig, dest.i, dest.j));
  }
}

export default FlowFieldGenerator;
