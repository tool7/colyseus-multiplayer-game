import * as PIXI from "pixi.js";

type Island = PIXI.Polygon;

interface MapConfiguration {
  islands: Island[];
}

export default MapConfiguration;
