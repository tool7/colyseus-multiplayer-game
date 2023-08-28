import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import { MAP_GRID_WIDTH, MAP_GRID_HEIGHT, MAP_GRID_CELL_SIZE } from "./utils/constants";
import GameObject from "./models/game-object";
import Ship from "./core/ship";
import CameraState from "./core/camera-state";
import WorldMap from "./core/world-map";
import ShipController from "./core/ship-controller";
import DebugController from "./utils/debug-controller";
import WORLDS from "./data/worlds";

const gameContainer = document.querySelector(".game") as HTMLDivElement;
const gameObjects: GameObject[] = [];
const worldConfig = WORLDS.DUMMY;

DebugController.init();

const app = new PIXI.Application<HTMLCanvasElement>({
  resizeTo: gameContainer,
  resolution: window.devicePixelRatio,
});
gameContainer.appendChild(app.view);

// Enabling "PixiJS Devtools" browser extension
globalThis.__PIXI_APP__ = app;

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: MAP_GRID_WIDTH * MAP_GRID_CELL_SIZE,
  worldHeight: MAP_GRID_HEIGHT * MAP_GRID_CELL_SIZE,
  events: app.renderer.events,
});
app.stage.addChild(viewport);

viewport
  .drag({ mouseButtons: "middle" })
  .wheel()
  .clampZoom({ maxScale: 1, minScale: 0.25 })
  .animate({ ease: "linear", time: 1000 });

viewport.fit();
viewport.moveCenter(viewport.worldWidth / 2, viewport.worldHeight / 2);
viewport.on("zoomed", () => {
  CameraState.setZoomLevel(viewport.scaled);
});

CameraState.setZoomLevel(viewport.scaled);

window.onload = () => {
  const worldMap = new WorldMap(worldConfig);
  viewport.addChild(worldMap.renderObject);

  const playerShips: Ship[] = [];

  worldConfig.playerSetup.forEach((player) => {
    const ship = new Ship(player.color);
    const { x, y } = player.initialPosition;
    const transform = new PIXI.Transform();
    transform.position.set(x, y);
    transform.rotation = player.initialRotation;
    ship.transform = transform;

    playerShips.push(ship);
    gameObjects.push(ship);
    viewport.addChild(ship.renderObject);
  });

  const shipController = new ShipController(viewport, worldConfig, playerShips);
  gameObjects.push(shipController);
  viewport.addChild(shipController.renderObject);

  app.stage.addChild(shipController.mouseAreaSelection.renderObject);
};

app.ticker.add((delta) => {
  for (const gameObject of gameObjects) {
    gameObject.update?.(delta);
  }
});

window.addEventListener("contextmenu", (e) => e.preventDefault());
