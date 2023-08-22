import PlayerColor from "../models/player-color";

const MAP_GRID_WIDTH = 40;
const MAP_GRID_HEIGHT = 30;
const MAP_GRID_CELL_SIZE = 64;

const SHIP_MAX_VELOCITY = 1;
const SHIP_TURN_SPEED = 0.01;
const SHIP_SELECTION_INDICATOR_COLOR = 0x203e8c;
const SHIP_WIDTH = 56.5;
const SHIP_HEIGHT = 33;
const SHIP_NEIGHBORHOOD_RADIUS = 100;
const SHIP_REPULSION_FORCE = 10;

const PLAYER_COLOR_SHIP_SPRITES: Record<PlayerColor, string> = {
  [PlayerColor.RED]: "dist/assets/ship_red.png",
  [PlayerColor.GREEN]: "dist/assets/ship_green.png",
  [PlayerColor.BLUE]: "dist/assets/ship_blue.png",
  [PlayerColor.YELLOW]: "dist/assets/ship_yellow.png",
};

export {
  MAP_GRID_WIDTH,
  MAP_GRID_HEIGHT,
  MAP_GRID_CELL_SIZE,
  SHIP_MAX_VELOCITY,
  SHIP_TURN_SPEED,
  SHIP_WIDTH,
  SHIP_HEIGHT,
  SHIP_NEIGHBORHOOD_RADIUS,
  SHIP_REPULSION_FORCE,
  PLAYER_COLOR_SHIP_SPRITES,
  SHIP_SELECTION_INDICATOR_COLOR,
};
