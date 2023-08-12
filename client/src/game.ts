import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import { MAP_GRID_WIDTH, MAP_GRID_HEIGHT, MAP_GRID_CELL_SIZE } from "./utils/constants";
import GameObject from "./models/game-object";
import PlayerColor from "./models/player-color";
import Ship from "./core/ship";
import CameraState from "./core/camera-state";
import MouseAreaSelection from "./core/mouse-area-selection";
import WorldMap from "./core/world-map";
import DebugController from "./utils/debug-controller";
import MapConfiguration from "./models/map-configuration";

const gameContainer = document.querySelector(".game") as HTMLDivElement;
const gameObjects: Array<GameObject> = [];
let selectedShips: Array<Ship> = [];

// ===== WORLD CONFIG =====
const players = [
  { initialPosition: { x: 200, y: 200 }, initialRotation: -1, color: PlayerColor.RED },
  { initialPosition: { x: 1000, y: 1600 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
  { initialPosition: { x: 2000, y: 200 }, initialRotation: 1, color: PlayerColor.BLUE },
];
const mapConfiguration: MapConfiguration = {
  islands: [
    new PIXI.Polygon([
      { x: 600, y: 370 },
      { x: 700, y: 260 },
      { x: 780, y: 420 },
      { x: 730, y: 570 },
      { x: 590, y: 520 },
    ]),
    new PIXI.Polygon([
      { x: 1600, y: 1370 },
      { x: 1700, y: 1360 },
      { x: 1780, y: 1420 },
      { x: 1730, y: 1570 },
      { x: 1590, y: 1520 },
    ]),
    new PIXI.Polygon([
      { x: 1600, y: 500 },
      { x: 1700, y: 600 },
      { x: 1780, y: 700 },
      { x: 1730, y: 800 },
      { x: 1590, y: 900 },
      { x: 1200, y: 800 },
      { x: 1150, y: 600 },
      { x: 1300, y: 500 },
    ]),
  ],
};
// ========================

DebugController.init();

const app = new PIXI.Application<HTMLCanvasElement>({
  resizeTo: gameContainer,
  resolution: window.devicePixelRatio,
});
gameContainer.appendChild(app.view);

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
CameraState.setZoomLevel(viewport.scaled);

window.onload = () => {
  const worldMap = new WorldMap(viewport, mapConfiguration);

  viewport.on("zoomed", () => {
    CameraState.setZoomLevel(viewport.scaled);
  });

  viewport.on("rightclick", (e) => {
    const { x, y } = e.getLocalPosition(viewport);
    if (x < 0 || x > viewport.worldWidth || y < 0 || y > viewport.worldHeight) {
      return;
    }

    const flowField = worldMap.getFlowFieldForPosition(x, y);

    selectedShips.forEach((ship) => {
      ship.followFlowField(flowField);
    });
  });

  players.forEach((player) => {
    const ship = new Ship(player.color);
    const { x, y } = player.initialPosition;
    const transform = new PIXI.Transform();
    transform.position.set(x, y);
    transform.rotation = player.initialRotation;
    ship.transform = transform;

    ship.displayObject.on("click", () => {
      selectedShips.forEach((ship) => ship.setSelected(false));
      ship.setSelected(true);
      selectedShips = [ship];
    });

    gameObjects.push(ship);
    viewport.addChild(ship.displayObject);
  });

  const mouseAreaSelection = new MouseAreaSelection(viewport);
  app.stage.addChild(mouseAreaSelection.displayObject);

  mouseAreaSelection.selectionEvent.on("select", (area: PIXI.Rectangle) => {
    selectedShips.forEach((ship) => ship.setSelected(false));
    selectedShips = (gameObjects as Array<Ship>).filter((ship) => {
      const global = ship.displayObject.toGlobal(worldMap.displayObject.position);
      return area.contains(global.x, global.y);
    });
    selectedShips.forEach((ship) => ship.setSelected(true));
  });
};

app.ticker.add((delta) => {
  for (const gameObject of gameObjects) {
    gameObject.update(delta);
  }
});

window.addEventListener("contextmenu", (e) => e.preventDefault());
