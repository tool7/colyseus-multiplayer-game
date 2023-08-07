import hullBase64 from "../assets/ship_hull.png";
import sailsRedBase64 from "../assets/ship_sails_red.png";
import sailsGreenBase64 from "../assets/ship_sails_green.png";
import sailsBlueBase64 from "../assets/ship_sails_blue.png";
import sailsYellowBase64 from "../assets/ship_sails_yellow.png";

import PlayerColor from "../models/player-color";

const MAP_WIDTH = 3840;
const MAP_HEIGHT = 1920;

const SHIP_DEFAULT_VELOCITY = 1;
const SHIP_TARGET_HALT_MIN_DISTANCE = 1;

const SHIP_HULL_SPRITE_SRC = hullBase64;
const PLAYER_COLOR_SHIP_SAILS_SPRITES: Record<PlayerColor, string> = {
  [PlayerColor.RED]: sailsRedBase64,
  [PlayerColor.GREEN]: sailsGreenBase64,
  [PlayerColor.BLUE]: sailsBlueBase64,
  [PlayerColor.YELLOW]: sailsYellowBase64,
};
const SHIP_SELECTION_INDICATOR_COLOR = 0x203e8c;

export {
  MAP_WIDTH,
  MAP_HEIGHT,
  SHIP_DEFAULT_VELOCITY,
  SHIP_TARGET_HALT_MIN_DISTANCE,
  SHIP_HULL_SPRITE_SRC,
  PLAYER_COLOR_SHIP_SAILS_SPRITES,
  SHIP_SELECTION_INDICATOR_COLOR,
};
