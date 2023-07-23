import { createServer } from "http";
import express from "express";
import { pino } from "pino";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";

import { CoolRoom } from "./room.js";

const PORT = Number(process.env.port) || 3030;
const app = express();

app.use("/monitor", monitor());

const server = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
  devMode: true,
  logger: pino({
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  }),
});

gameServer.define("cool-room", CoolRoom);

gameServer.listen(PORT);
