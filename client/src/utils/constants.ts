import PlayerColor from "../models/player-color";

const DEBUG_FLOW_FIELD_GRID_ENABLED = true;

const MAP_WIDTH = 2560;
const MAP_HEIGHT = 1920;

const SHIP_DEFAULT_VELOCITY = 1;
const SHIP_TARGET_HALT_MIN_DISTANCE = 1;

const SHIP_HULL_SPRITE_SRC = "dist/assets/ship_hull.png";
const PLAYER_COLOR_SHIP_SAILS_SPRITES: Record<PlayerColor, string> = {
  [PlayerColor.RED]: "dist/assets/ship_sails_red.png",
  [PlayerColor.GREEN]: "dist/assets/ship_sails_green.png",
  [PlayerColor.BLUE]: "dist/assets/ship_sails_blue.png",
  [PlayerColor.YELLOW]: "dist/assets/ship_sails_yellow.png",
};
const SHIP_SELECTION_INDICATOR_COLOR = 0x203e8c;

export {
  DEBUG_FLOW_FIELD_GRID_ENABLED,
  MAP_WIDTH,
  MAP_HEIGHT,
  SHIP_DEFAULT_VELOCITY,
  SHIP_TARGET_HALT_MIN_DISTANCE,
  SHIP_HULL_SPRITE_SRC,
  PLAYER_COLOR_SHIP_SAILS_SPRITES,
  SHIP_SELECTION_INDICATOR_COLOR,
};
