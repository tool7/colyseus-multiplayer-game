import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import { MAP_HEIGHT, MAP_WIDTH } from "./utils/constants";
import GameObject from "./models/game-object";
import PlayerColor from "./models/player-color";
import Ship from "./core/ship";
import CameraState from "./core/camera-state";
import MouseAreaSelection from "./core/mouse-area-selection";
import WorldMap from "./core/world-map";

const gameContainer = document.querySelector(".game") as HTMLDivElement;
const gameObjects: Array<GameObject> = [];
const mouseCoords = new PIXI.Point(0, 0);
let selectedShips: Array<Ship> = [];

const players = [
  { initialPosition: { x: 200, y: 200 }, initialRotation: -1, color: PlayerColor.RED },
  { initialPosition: { x: 1000, y: 1600 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
  { initialPosition: { x: 2000, y: 200 }, initialRotation: 1, color: PlayerColor.BLUE },
];

const app = new PIXI.Application<HTMLCanvasElement>({
  resizeTo: gameContainer,
  resolution: window.devicePixelRatio,
});
gameContainer.appendChild(app.view);

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: MAP_WIDTH,
  worldHeight: MAP_HEIGHT,
  events: app.renderer.events,
});
app.stage.addChild(viewport);

viewport
  .drag({ mouseButtons: "middle" })
  .wheel()
  .clampZoom({ maxScale: 1, minScale: 0.25 })
  .animate({ ease: "linear", time: 1000 });

viewport.fit();
viewport.moveCenter(MAP_WIDTH / 2, MAP_HEIGHT / 2);
CameraState.setZoomLevel(viewport.scaled);

window.onload = () => {
  const worldMap = new WorldMap(viewport);

  viewport.on("zoomed", () => {
    CameraState.setZoomLevel(viewport.scaled);
  });

  viewport.on("rightclick", (e) => {
    const { x, y } = e.getLocalPosition(viewport);
    if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) {
      return;
    }

    mouseCoords.x = x;
    mouseCoords.y = y;

    // TODO: Testing purposes
    worldMap.initializeFlowFieldAt(x, y);

    // selectedShips.forEach((ship) => {
    //   ship.goTo(mouseCoords);
    // });
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
