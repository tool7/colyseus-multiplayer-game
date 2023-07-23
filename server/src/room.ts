import { Room, Client } from "@colyseus/core";
import { Schema, type } from "@colyseus/schema";

export class CoolRoomState extends Schema {
  @type("string")
  mySynchronizedProperty: string = "Hello world";
}

export class CoolRoom extends Room<CoolRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new CoolRoomState());

    this.onMessage("fire", (client, message) => {
      console.log("Message from client:", message);

      client.send("move", { x: 100, y: 200 });
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
