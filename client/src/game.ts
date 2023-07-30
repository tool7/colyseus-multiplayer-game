import * as PIXI from "pixi.js";
import GameObject from "./models/game-object";
import PlayerColor from "./models/player-color";
import Ship from "./models/ship";

const sceneContainer = document.querySelector(".scene") as HTMLDivElement;
const gameObjects: Array<GameObject> = [];

const players = [
  { initialPosition: { x: 100, y: 100 }, initialRotation: -1, color: PlayerColor.RED },
  { initialPosition: { x: 500, y: 700 }, initialRotation: Math.PI, color: PlayerColor.GREEN },
  { initialPosition: { x: 800, y: 100 }, initialRotation: 1, color: PlayerColor.BLUE },
];

const app = new PIXI.Application<HTMLCanvasElement>({
  background: "#99e0f2",
  resizeTo: sceneContainer,
});

sceneContainer.appendChild(app.view);

players.forEach((player) => {
  const ship = new Ship(player.color);
  const { x, y } = player.initialPosition;
  ship.setPosition(x, y);
  ship.setRotation(player.initialRotation);

  gameObjects.push(ship);
  app.stage.addChild(ship.displayObject);
});

app.ticker.add(() => {
  // const { x, y, rotation } = gameObjects[0].displayObject;
  // gameObjects[0].setPosition(x + 0.1, y);
  // gameObjects[0].setRotation(rotation + 0.01);
});
