import { Engine, World, Runner, Body, Bodies, Mouse, MouseConstraint } from "matter-js";
import * as PIXI from "pixi.js";

const sceneContainer = document.querySelector(".scene") as HTMLDivElement;
const canvasWidth = sceneContainer.offsetWidth;
const canvasHeight = sceneContainer.offsetHeight;
let canvasPrevWidth = canvasWidth;
let canvasPrevHeight = canvasHeight;

const engine = Engine.create();

const images = [
  {
    src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
    initialPosition: { x: 300, y: 180 },
    width: 200,
    height: 100,
  },
  {
    src: "https://images.unsplash.com/photo-1526312426976-f4d754fa9bd6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
    initialPosition: { x: 300, y: 180 },
    width: 200,
    height: 100,
  },
  {
    src: "https://images.unsplash.com/photo-1534214526114-0ea4d47b04f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
    initialPosition: { x: 500, y: 180 },
    width: 200,
    height: 100,
  },
];

const sceneObjects: Array<{ body: Body; sprite: PIXI.Sprite }> = [];

const wallTop = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 10, { isStatic: true });
const wallBottom = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 10, { isStatic: true });
const wallRight = Bodies.rectangle(canvasWidth, canvasHeight / 2, 10, canvasHeight, { isStatic: true });
const wallLeft = Bodies.rectangle(0, canvasHeight / 2, 10, canvasHeight, { isStatic: true });

World.add(engine.world, [wallBottom, wallTop, wallLeft, wallRight]);

const app = new PIXI.Application<HTMLCanvasElement>({
  background: "#99e0f2",
  resizeTo: sceneContainer,
});

sceneContainer.appendChild(app.view);

const createSceneObject = (image: any) => {
  const imageBody = Bodies.rectangle(image.initialPosition.x, image.initialPosition.y, image.width, image.height, {
    restitution: 0.8,
  });
  World.addBody(engine.world, imageBody);

  const imageSprite = PIXI.Sprite.from(image.src);
  imageSprite.width = image.width;
  imageSprite.height = image.height;
  imageSprite.anchor.set(0.5, 0.5);
  app.stage.addChild(imageSprite);

  sceneObjects.push({ body: imageBody, sprite: imageSprite });
};

app.ticker.add(() => {
  sceneObjects.forEach((obj) => {
    obj.sprite.position = obj.body.position;
    obj.sprite.rotation = obj.body.angle;
  });
});

const mouseConstraint = MouseConstraint.create(engine, {
  mouse: Mouse.create(sceneContainer.querySelector("canvas")),
});

World.add(engine.world, mouseConstraint);

window.addEventListener("resize", (event) => {
  const canvasWidth = sceneContainer.offsetWidth;
  const canvasHeight = sceneContainer.offsetHeight;

  Body.setPosition(wallLeft, { x: 0, y: canvasHeight / 2 });
  Body.scale(wallLeft, 1, canvasHeight / canvasPrevHeight);

  Body.setPosition(wallRight, { x: canvasWidth, y: canvasHeight / 2 });
  Body.scale(wallRight, 1, canvasHeight / canvasPrevHeight);

  Body.setPosition(wallTop, { x: canvasWidth / 2, y: 0 });
  Body.scale(wallTop, canvasWidth / canvasPrevWidth, 1);

  Body.setPosition(wallBottom, { x: canvasWidth / 2, y: canvasHeight });
  Body.scale(wallBottom, canvasWidth / canvasPrevWidth, 1);

  canvasPrevWidth = canvasWidth;
  canvasPrevHeight = canvasHeight;
});

images.forEach((image) => {
  createSceneObject(image);
});

const runner = Runner.create({ isFixed: true });
Runner.run(runner, engine);
