import * as PIXI from "pixi.js";
import { Button, ButtonContainer } from "@pixi/ui";
import { Text } from "@pixi/text";
import { Graphics } from "@pixi/graphics";

import GameObject from "../models/game-object";

class GameUI extends GameObject {
  private container: PIXI.Container;

  constructor() {
    super();

    this.container = new PIXI.Container();

    const button = new ButtonContainer();
    button.x = window.innerWidth / 2;
    button.y = window.innerHeight - 100;

    button.enabled = true;
    button.onPress.connect(() => console.log("onPress"));
    button.onDown.connect(() => console.log("onDown"));
    button.onUp.connect(() => console.log("onUp"));
    button.onHover.connect(() => console.log("onHover"));
    button.onOut.connect(() => console.log("onOut"));
    button.onUpOut.connect(() => console.log("onUpOut"));

    const buttonGraphics = new Graphics().beginFill("black").drawRoundedRect(0, 0, 120, 50, 4);
    const text = new Text("Click me", { fontSize: 24, fill: "white" });
    text.anchor.set(0.5);
    text.x = buttonGraphics.width / 2;
    text.y = buttonGraphics.height / 2;
    buttonGraphics.addChild(text);

    button.addChild(buttonGraphics);
    this.container.addChild(button);
  }

  get renderObject() {
    return this.container;
  }
  get transform() {
    return this.container.transform;
  }

  update(delta: number) {}
}

export default GameUI;
