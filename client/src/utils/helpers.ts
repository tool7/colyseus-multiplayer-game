import * as PIXI from "pixi.js";

function distanceBetweenPoints(p1: PIXI.Point, p2: PIXI.Point): number {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.hypot(a, b);
}

function interpolateFromOneRangeToAnother(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
): number {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export { distanceBetweenPoints, interpolateFromOneRangeToAnother };
