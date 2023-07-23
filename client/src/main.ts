import * as Colyseus from "colyseus.js";

import "./style.css";
import "./game";

// const client = new Colyseus.Client("ws://localhost:3030");
// const enterRoomButton = document.getElementById("enter-room-btn");
// console.log(client);

// enterRoomButton.onclick = async () => {
//   try {
//     const room = await client.joinOrCreate("cool-room");

//     console.log(room.sessionId, "joined", room.name);

//     room.send("fire", { x: 1, y: 2 });

//     room.onMessage("move", (message) => {
//       console.log("Message from server:", message);
//     });
//   } catch (error) {
//     console.log("JOIN ERROR", error);
//   }
// };
