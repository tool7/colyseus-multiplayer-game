import * as PIXI from "pixi.js";

function distanceBetweenPoints(p1: PIXI.Point, p2: PIXI.Point) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.hypot(a, b);
}

export { distanceBetweenPoints };
