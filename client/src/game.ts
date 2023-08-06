import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

import GameObject from "./models/game-object";
import PlayerColor from "./models/player-color";
import Ship from "./core/ship";
import { MAP_HEIGHT, MAP_WIDTH } from "./utils/constants";
import { interpolateFromOneRangeToAnother } from "./utils/helpers";

const gameContainer = document.querySelector(".game") as HTMLDivElement;
const gameObjects: Array<GameObject> = [];
const mouseCoords = new PIXI.Point(0, 0);
const selectedAreaStartPosition = new PIXI.Point();
let selectedShips: Array<Ship> = [];

const players = [
  { initialPosition: { x: 100, y: 100 }, initialRotation: -1, color: PlayerColor.RED },
  { initialPosition: { x: 500, y: 700 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
  { initialPosition: { x: 800, y: 100 }, initialRotation: 1, color: PlayerColor.BLUE },
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
  .drag({
    mouseButtons: "middle",
  })
  .wheel()
  .clampZoom({
    maxScale: 1,
    minScale: 0.25,
  })
  .animate({
    ease: "linear",
    time: 1000,
  });

viewport.fit();
viewport.moveCenter(MAP_WIDTH / 2, MAP_HEIGHT / 2);

const background = new PIXI.Sprite(PIXI.Texture.WHITE);
background.eventMode = "static";
background.tint = "#99e0f2";
background.width = MAP_WIDTH;
background.height = MAP_HEIGHT;
viewport.addChild(background);

background.on("rightclick", (e) => {
  const localPosition = e.getLocalPosition(background);
  const x = interpolateFromOneRangeToAnother(localPosition.x, 0, 16, 0, MAP_WIDTH);
  const y = interpolateFromOneRangeToAnother(localPosition.y, 0, 16, 0, MAP_HEIGHT);
  mouseCoords.x = x;
  mouseCoords.y = y;

  selectedShips.forEach((ship) => {
    ship.goTo(mouseCoords);
  });
});

// ===== SELECTION CONTROLS =====
viewport.on("mousedown", (e) => {
  selectedShips = [];

  const { x, y } = e.global;
  selectedAreaStartPosition.set(x, y);
});
viewport.on("mouseup", (e) => {
  const selectedAreaUpperLeftX = Math.min(selectedAreaStartPosition.x, e.global.x);
  const selectedAreaUpperLeftY = Math.min(selectedAreaStartPosition.y, e.global.y);
  const selectedAreaWidth = Math.abs(selectedAreaStartPosition.x - e.global.x);
  const selectedAreaHeight = Math.abs(selectedAreaStartPosition.y - e.global.y);
  const selectedArea = new PIXI.Rectangle(
    selectedAreaUpperLeftX,
    selectedAreaUpperLeftY,
    selectedAreaWidth,
    selectedAreaHeight
  );

  // console.log("x", selectedAreaUpperLeftX);
  // console.log("y", selectedAreaUpperLeftY);
  // console.log("width", selectedAreaWidth);
  // console.log("height", selectedAreaHeight);

  selectedShips = (gameObjects as Array<Ship>).filter((ship) => {
    const global = ship.displayObject.toGlobal(background.position);

    // console.log("global", global.x, global.y);
    // console.log("ship.position", ship.position.x, ship.position.y);

    return selectedArea.contains(global.x, global.y);
  });

  console.log("selectedShips", selectedShips);
});
// ==============================

players.forEach((player) => {
  const ship = new Ship(player.color);
  const { x, y } = player.initialPosition;
  ship.position = new PIXI.Point(x, y);
  ship.rotation = player.initialRotation;

  ship.displayObject.on("click", () => {
    selectedShips = [ship];
  });

  gameObjects.push(ship);
  viewport.addChild(ship.displayObject);
});

app.ticker.add((delta) => {
  for (const gameObject of gameObjects) {
    gameObject.update(delta);
  }
});

window.addEventListener("contextmenu", (e) => e.preventDefault());
