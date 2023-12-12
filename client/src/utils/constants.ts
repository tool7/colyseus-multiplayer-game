import PlayerColor from "../models/player-color";
import WindDirection from "../models/wind-direction";

const MAP_GRID_WIDTH = 40;
const MAP_GRID_HEIGHT = 30;
const MAP_GRID_CELL_SIZE = 64;

const SHIP_MAX_VELOCITY = 1;
const SHIP_TURN_SPEED = 0.01;
const SHIP_WIDTH = 56.5;
const SHIP_HEIGHT = 33;
const SHIP_NEIGHBORHOOD_RADIUS = 100;
const SHIP_REPULSION_FORCE = 10;

const WAVES_SPRITE_OPACITY = 0.8;

const PLAYER_COLOR_SHIP_SPRITES: Record<PlayerColor, string> = {
  [PlayerColor.RED]: "dist/assets/ship_red.png",
  [PlayerColor.GREEN]: "dist/assets/ship_green.png",
  [PlayerColor.BLUE]: "dist/assets/ship_blue.png",
  [PlayerColor.YELLOW]: "dist/assets/ship_yellow.png",
};

const WAVES_SPRITES: Record<WindDirection, string> = {
  [WindDirection.NORTH]: "dist/assets/waves/waves_bottom.png",
  [WindDirection.NORTH_EAST]: "dist/assets/waves/waves_bottom_left.png",
  [WindDirection.EAST]: "dist/assets/waves/waves_left.png",
  [WindDirection.SOUTH_EAST]: "dist/assets/waves/waves_top_left.png",
  [WindDirection.SOUTH]: "dist/assets/waves/waves_top.png",
  [WindDirection.SOUTH_WEST]: "dist/assets/waves/waves_top_right.png",
  [WindDirection.WEST]: "dist/assets/waves/waves_right.png",
  [WindDirection.NORTH_WEST]: "dist/assets/waves/waves_bottom_right.png",
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
  WAVES_SPRITE_OPACITY,
  PLAYER_COLOR_SHIP_SPRITES,
  WAVES_SPRITES,
};
