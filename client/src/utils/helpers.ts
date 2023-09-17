import * as PIXI from "pixi.js";

function distanceBetweenPoints(p1: PIXI.Point, p2: PIXI.Point): number {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.hypot(a, b);
}

function getVectorBetweenPoints(from: PIXI.Point, to: PIXI.Point): PIXI.Point {
  return new PIXI.Point(to.x - from.x, to.y - from.y);
}

function getVectorMagnitude(vector: PIXI.Point): number {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

function rangeLerp(value: number, min1: number, max1: number, min2: number, max2: number): number {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function normalizeVector(vector: PIXI.Point): PIXI.Point {
  const magnitude = getVectorMagnitude(vector);
  return new PIXI.Point(vector.x / magnitude, vector.y / magnitude);
}

function normalizeAngle(angle: number): number {
  while (angle > Math.PI) {
    angle -= 2 * Math.PI;
  }
  while (angle < -Math.PI) {
    angle += 2 * Math.PI;
  }
  return angle;
}

function transformPolygonToWorldCoords(
  polygon: PIXI.Polygon,
  width: number,
  height: number,
  xOffset: number,
  yOffset: number,
  scaleFactor: number
): PIXI.Polygon {
  const polygonPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < polygon.points.length - 1; i += 2) {
    const x = polygon.points[i];
    const y = polygon.points[i + 1];
    polygonPoints.push({ x, y });
  }

  const transformedVertices = polygonPoints.map(({ x, y }) => {
    return {
      x: x * scaleFactor + xOffset - (width * scaleFactor) / 2,
      y: y * scaleFactor + yOffset - (height * scaleFactor) / 2,
    };
  });
  return new PIXI.Polygon(transformedVertices);
}

function rgbToHex(r: number, g: number, b: number) {
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

export {
  distanceBetweenPoints,
  getVectorBetweenPoints,
  getVectorMagnitude,
  rangeLerp,
  degreesToRadians,
  normalizeVector,
  normalizeAngle,
  transformPolygonToWorldCoords,
  rgbToHex,
};
