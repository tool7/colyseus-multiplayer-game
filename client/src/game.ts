import * as PIXI from "pixi.js";
import GameObject from "./models/game-object";
import PlayerColor from "./models/player-color";
import Ship from "./core/ship";
import { MAP_HEIGHT, MAP_WIDTH } from "./utils/constants";

const sceneContainer = document.querySelector(".scene") as HTMLDivElement;
const gameObjects: Array<GameObject> = [];
const mouseCoords = new PIXI.Point(0, 0);

const players = [
  { initialPosition: { x: 100, y: 100 }, initialRotation: -1, color: PlayerColor.RED },
  { initialPosition: { x: 500, y: 700 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
  { initialPosition: { x: 800, y: 100 }, initialRotation: 1, color: PlayerColor.BLUE },
];

const app = new PIXI.Application<HTMLCanvasElement>({
  resizeTo: sceneContainer,
});

const background = new PIXI.Sprite(PIXI.Texture.WHITE);
background.eventMode = "static";
background.tint = "#99e0f2";
background.width = MAP_WIDTH;
background.height = MAP_HEIGHT;

background.on("click", (event) => {
  mouseCoords.x = event.global.x;
  mouseCoords.y = event.global.y;

  // TODO: Testing ship movement
  gameObjects.forEach((gameObject) => {
    (gameObject as Ship).goTo(mouseCoords);
  });
});

app.stage.addChild(background);
sceneContainer.appendChild(app.view);

players.forEach((player) => {
  const ship = new Ship(player.color);
  const { x, y } = player.initialPosition;
  ship.position = new PIXI.Point(x, y);
  ship.rotation = player.initialRotation;

  gameObjects.push(ship);
  app.stage.addChild(ship.displayObject);
});

app.ticker.add((delta) => {
  for (const gameObject of gameObjects) {
    gameObject.update(delta);
  }
});
