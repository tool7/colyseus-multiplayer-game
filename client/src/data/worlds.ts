import { WorldConfig } from "../models/world-config";
import PlayerColor from "../models/player-color";
import ISLANDS from "./islands";
import { MAP_GRID_CELL_SIZE, MAP_GRID_HEIGHT, MAP_GRID_WIDTH } from "../utils/constants";

type WorldName =
  | "WORLD_1"
  | "WORLD_2"
  | "WORLD_3"
  | "WORLD_4"
  | "WORLD_5"
  | "WORLD_6"
  | "WORLD_7"
  | "WORLD_8"
  | "WORLD_9";

const WORLD_WIDTH = MAP_GRID_WIDTH * MAP_GRID_CELL_SIZE;
const WORLD_HEIGHT = MAP_GRID_HEIGHT * MAP_GRID_CELL_SIZE;

const WORLDS: Record<WorldName, WorldConfig> = {
  WORLD_1: {
    playerSetup: [
      { initialPosition: { x: 500, y: 200 }, initialRotation: 0, color: PlayerColor.RED },
      { initialPosition: { x: 1000, y: 1700 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
      { initialPosition: { x: 1800, y: 200 }, initialRotation: 1, color: PlayerColor.BLUE },
    ],
    islands: [
      {
        ...ISLANDS.HIGH_2,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
        rotation: 0.3,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_3,
        position: { x: WORLD_WIDTH / 2, y: 300 },
        rotation: -0.7,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_4,
        position: { x: WORLD_WIDTH - 300, y: WORLD_HEIGHT / 2 },
        rotation: 0,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_2,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT - 300 },
        rotation: -1.4,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_1,
        position: { x: 300, y: WORLD_HEIGHT / 2 },
        rotation: -0.5,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_2: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.HIGH_1,
        position: { x: WORLD_WIDTH / 2, y: 350 },
        rotation: 0,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_4,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT - 350 },
        rotation: 0,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_3,
        position: { x: 500, y: WORLD_HEIGHT / 2 - 100 },
        rotation: 0,
        scaleFactor: 0.7,
      },
      {
        ...ISLANDS.HIGH_5,
        position: { x: WORLD_WIDTH - 500, y: WORLD_HEIGHT / 2 },
        rotation: -0.5,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_3: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.HIGH_4,
        position: { x: WORLD_WIDTH - 700, y: WORLD_HEIGHT / 2 - 300 },
        rotation: 1,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_3,
        position: { x: 700, y: WORLD_HEIGHT / 2 - 300 },
        rotation: -0.2,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_2,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT - 500 },
        rotation: -2.5,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_4: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.HIGH_3,
        position: { x: 500, y: WORLD_HEIGHT / 2 },
        rotation: -0.3,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_5,
        position: { x: WORLD_WIDTH / 2 + 100, y: 400 },
        rotation: -1.2,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_1,
        position: { x: WORLD_WIDTH - 500, y: WORLD_HEIGHT / 2 + 350 },
        rotation: 0.5,
        scaleFactor: 0.7,
      },
      {
        ...ISLANDS.LOW_2,
        position: { x: WORLD_WIDTH / 2 - 200, y: WORLD_HEIGHT - 350 },
        rotation: -1,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_3,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
        rotation: 0,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_5: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.HIGH_1,
        position: { x: WORLD_WIDTH / 2 + 500, y: 600 },
        rotation: 0,
        scaleFactor: 0.7,
      },
      {
        ...ISLANDS.LOW_3,
        position: { x: WORLD_WIDTH - 500, y: WORLD_HEIGHT - 600 },
        rotation: 1.5,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_5,
        position: { x: WORLD_WIDTH / 2 - 200, y: WORLD_HEIGHT / 2 + 300 },
        rotation: -1,
        scaleFactor: 0.7,
      },
      {
        ...ISLANDS.LOW_2,
        position: { x: 600, y: 600 },
        rotation: 1,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_6: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.LOW_4,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
        rotation: 0,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_7: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.LOW_5,
        position: { x: 400, y: WORLD_HEIGHT / 2 },
        rotation: 0,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_5,
        position: { x: WORLD_WIDTH - 400, y: WORLD_HEIGHT / 2 },
        rotation: 3.14,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_2,
        position: { x: WORLD_WIDTH / 2, y: 300 },
        rotation: 2,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.LOW_2,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT - 300 },
        rotation: -1,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_8: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.HIGH_4,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 - 400 },
        rotation: 2.8,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_4,
        position: { x: WORLD_WIDTH / 2 + 400, y: WORLD_HEIGHT / 2 },
        rotation: -1.9,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_4,
        position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 + 400 },
        rotation: -0.3,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_4,
        position: { x: WORLD_WIDTH / 2 - 400, y: WORLD_HEIGHT / 2 },
        rotation: 1.2,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
  WORLD_9: {
    playerSetup: [],
    islands: [
      {
        ...ISLANDS.HIGH_5,
        position: { x: WORLD_WIDTH / 2 + 100, y: WORLD_HEIGHT / 2 - 500 },
        rotation: -1.3,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_5,
        position: { x: WORLD_WIDTH / 2 + 500, y: WORLD_HEIGHT / 2 },
        rotation: 0,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_5,
        position: { x: WORLD_WIDTH / 2 + 100, y: WORLD_HEIGHT / 2 + 500 },
        rotation: 1.3,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_5,
        position: { x: WORLD_WIDTH / 2 - 500, y: WORLD_HEIGHT / 2 + 300 },
        rotation: 2.5,
        scaleFactor: 0.6,
      },
      {
        ...ISLANDS.HIGH_5,
        position: { x: WORLD_WIDTH / 2 - 500, y: WORLD_HEIGHT / 2 - 300 },
        rotation: -2.5,
        scaleFactor: 0.6,
      },
    ],
    storms: [],
  },
};

export default WORLDS;
