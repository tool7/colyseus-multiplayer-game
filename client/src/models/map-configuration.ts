import * as PIXI from "pixi.js";

type Island = PIXI.Polygon;
type Storm = PIXI.Polygon;

interface MapConfiguration {
  islands: Island[];
  storms: Storm[];
}

export default MapConfiguration;
