import * as PIXI from "pixi.js";

import PlayerColor from "./player-color";

export type PlayerSetup = {
  initialPosition: { x: number; y: number };
  initialRotation: number;
  color: PlayerColor;
};

export type Island = {
  position: { x: number; y: number };
  scaleFactor: number;
  spriteWidth: number;
  spriteHeight: number;
  spriteAssetPath: string;
  collider: PIXI.Polygon;
  highGroundCollider?: PIXI.Polygon;
};

export type Storm = {
  position: { x: number; y: number };
  scaleFactor: number;
  spriteWidth: number;
  spriteHeight: number;
  spriteAssetPath: string;
  collider: PIXI.Polygon;
};

export interface WorldConfig {
  playerSetup: PlayerSetup[];
  islands: Island[];
  storms: Storm[];
}
