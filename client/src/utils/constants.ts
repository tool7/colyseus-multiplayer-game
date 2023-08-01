import hullBase64 from "../assets/ship_hull.png";
import sailsRedBase64 from "../assets/ship_sails_red.png";
import sailsGreenBase64 from "../assets/ship_sails_green.png";
import sailsBlueBase64 from "../assets/ship_sails_blue.png";
import sailsYellowBase64 from "../assets/ship_sails_yellow.png";

import PlayerColor from "../models/player-color";

const MAP_WIDTH = 4000;
const MAP_HEIGHT = 2000;

const SHIP_HULL_SPRITE_SRC = hullBase64;
const PLAYER_COLOR_SHIP_SAILS_SPRITES: Record<PlayerColor, string> = {
  [PlayerColor.RED]: sailsRedBase64,
  [PlayerColor.GREEN]: sailsGreenBase64,
  [PlayerColor.BLUE]: sailsBlueBase64,
  [PlayerColor.YELLOW]: sailsYellowBase64,
};

export { MAP_WIDTH, MAP_HEIGHT, SHIP_HULL_SPRITE_SRC, PLAYER_COLOR_SHIP_SAILS_SPRITES };
