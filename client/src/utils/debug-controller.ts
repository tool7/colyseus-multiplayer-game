import * as dat from "dat.gui";
import * as PIXI from "pixi.js";

type DebugControl = "flowFieldType" | "showColliders";

class DebugController {
  private static datGui: dat.GUI;
  private static onControlChange = new PIXI.utils.EventEmitter<DebugControl>();
  private static controls: Record<DebugControl, any> = {
    flowFieldType: null,
    showColliders: false,
  };

  static init() {
    this.datGui = new dat.GUI();
    this.datGui
      .add(this.controls, "flowFieldType", {
        "-": "",
        cost: "cost",
        integration: "integration",
        flow: "flow",
      })
      .name("Show field type:")
      .onChange((value) => this.onControlChange.emit("flowFieldType", value));
    this.datGui
      .add(this.controls, "showColliders")
      .name("Show colliders:")
      .onChange((value) => this.onControlChange.emit("showColliders", value));

    this.datGui.show();
  }

  static onChange(control: DebugControl, callback: (val: any) => void) {
    this.onControlChange.on(control, (value) => {
      callback(value);
    });
  }
}

export default DebugController;
