import * as PIXI from "pixi.js";

import { Island } from "../models/world-config";

// This is needed due to differently exported pivot (bottom left) from "Physics Body Editor" program
const getHorizontallyMirroredPoints = (points: { x: number; y: number }[], height: number) => {
  return points.map(({ x, y }) => {
    return { x, y: height - y };
  });
};

type IslandType =
  | "HIGH_1"
  | "HIGH_2"
  | "HIGH_3"
  | "HIGH_4"
  | "HIGH_5"
  | "LOW_1"
  | "LOW_2"
  | "LOW_3"
  | "LOW_4"
  | "LOW_5";

const ISLANDS: Record<IslandType, Island> = {
  HIGH_1: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_high_1.png",
    collider: new PIXI.Polygon([]),
  },
  HIGH_2: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_high_2.png",
    collider: new PIXI.Polygon([]),
  },
  HIGH_3: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 528,
    spriteHeight: 816,
    spriteAssetPath: "dist/assets/islands/island_high_3.png",
    collider: new PIXI.Polygon(
      getHorizontallyMirroredPoints(
        [
          { x: 43.612518310546875, y: 40.125030517578125 },
          { x: 8.512527465820312, y: 127.20001220703125 },
          { x: 24.7125244140625, y: 231.82501220703125 },
          { x: 5.812530517578125, y: 380.3250427246094 },
          { x: 26.737518310546875, y: 527.4750366210938 },
          { x: 19.312515258789062, y: 725.2500610351562 },
          { x: 109.08750915527344, y: 799.5 },
          { x: 227.21250915527344, y: 808.9500732421875 },
          { x: 348.7124938964844, y: 774.5250244140625 },
          { x: 380.4374694824219, y: 659.1000366210938 },
          { x: 443.88751220703125, y: 547.7250366210938 },
          { x: 509.36248779296875, y: 470.7750549316406 },
          { x: 522.1875, y: 366.82501220703125 },
          { x: 510.0375061035156, y: 219.00001525878906 },
          { x: 411.4875183105469, y: 95.47500610351562 },
          { x: 301.4624938964844, y: 30 },
          { x: 163.76251220703125, y: 7.050018310546875 },
        ],
        816
      )
    ),
    highGroundCollider: new PIXI.Polygon(
      getHorizontallyMirroredPoints(
        [
          { x: 163.5623779296875, y: 678.2750244140625 },
          { x: 216.8873748779297, y: 670.8500366210938 },
          { x: 278.31231689453125, y: 641.1500244140625 },
          { x: 264.8123474121094, y: 580.4000244140625 },
          { x: 269.537353515625, y: 525.0499877929688 },
          { x: 301.93731689453125, y: 494.6750183105469 },
          { x: 400.4873046875, y: 461.60003662109375 },
          { x: 430.1873474121094, y: 408.95001220703125 },
          { x: 441.6623840332031, y: 337.4000244140625 },
          { x: 390.36236572265625, y: 261.8000183105469 },
          { x: 289.787353515625, y: 194.3000030517578 },
          { x: 231.7373504638672, y: 184.85000610351562 },
          { x: 211.48736572265625, y: 210.50001525878906 },
          { x: 233.7623748779297, y: 319.1750183105469 },
          { x: 162.8873748779297, y: 406.9250183105469 },
          { x: 152.76235961914062, y: 438.6500244140625 },
          { x: 139.9373779296875, y: 459.57501220703125 },
          { x: 154.1123809814453, y: 527.0750122070312 },
          { x: 143.98736572265625, y: 610.7750244140625 },
          { x: 125.76238250732422, y: 644.5250244140625 },
        ],
        816
      )
    ),
  },
  HIGH_4: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_high_4.png",
    collider: new PIXI.Polygon([]),
  },
  HIGH_5: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_high_5.png",
    collider: new PIXI.Polygon([]),
  },
  LOW_1: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_low_1.png",
    collider: new PIXI.Polygon([]),
  },
  LOW_2: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_low_2.png",
    collider: new PIXI.Polygon([]),
  },
  LOW_3: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_low_3.png",
    collider: new PIXI.Polygon([]),
  },
  LOW_4: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_low_4.png",
    collider: new PIXI.Polygon([]),
  },
  LOW_5: {
    position: { x: 0, y: 0 },
    scaleFactor: 1,
    spriteWidth: 1000,
    spriteHeight: 1000,
    spriteAssetPath: "dist/assets/islands/island_low_5.png",
    collider: new PIXI.Polygon([]),
  },
};

export default ISLANDS;
