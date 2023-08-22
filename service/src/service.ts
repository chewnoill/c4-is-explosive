import { HOST, PORT } from "./env";
import http from "http";
import app from "./app";
import setupSignalingConnection from "./utils/signaling-connection";
import ws from "ws";
import { loggerMiddleware } from "./logger";
import Session from "./session";

http.createServer(app);

const server = app.listen({ host: HOST, port: PORT });

console.log("Signaling server running on", HOST, ":", PORT);

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection-signaling", setupSignalingConnection);

const wrapMiddleware = (middleware) => (request, next) =>
  middleware(request, {}, next);

const websocketMiddleware = (request, next) =>
  wrapMiddleware(Session)(request, () =>
    wrapMiddleware(loggerMiddleware)(request, next)
  );

server.on("upgrade", (request, socket, head) => {
  // only handle upgrade if path matches
  console.log('upgrade')
  if (request.url.startsWith("/ws/signal")) {
    websocketMiddleware(request, () => {
      wsServer.handleUpgrade(request, socket, head, (socket) => {
        if (request.url.startsWith("/ws/signal")) {
          wsServer.emit("connection-signaling", socket, request);
        }
      });
    });
  }
});
