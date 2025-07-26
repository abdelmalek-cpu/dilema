import http from "http";
import { WebSocketServer } from "ws";
import { Game } from "../utilities/types";

const server = http.createServer();
const PORT = process.env.WS_PORT || 4001;
const MAXROUNDS = 15;
const wsServer = new WebSocketServer({ server });

const games: Record<string, Game> = {};

const createGame = (): string => {
  const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  if (games[gameCode]) {
    return createGame();
  }
  

  games[gameCode] = {
    code: gameCode,
    players: [{ id: 1, score: 0 }],
    currentRound: 1,
    maxRounds: MAXROUNDS,
    history: [],
  };
  console.log(`Game created with code: ${gameCode}`);
  return gameCode;
};

wsServer.on("connection", (connection) => {
  connection.on("connection", (connection) => {
    console.log("New client connected");
    connection.send(
      JSON.stringify({
        type: "welcome",
        message: "Welcome to the game server!",
      })
    );
  });

  connection.on("message", (message) => {
    const data = JSON.parse(message.toString());
    try {
      switch (data.type) {
        case "create-game": {
          const gameCode: string = createGame();
          connection.send(
            JSON.stringify({ type: "game-created", payload: { gameCode } })
          );
          break;
        }
        case "join-game": {
          const { gameCode, playerID } = data.payload;
          console.log(data.payload);
          if (!games[gameCode]) {
            connection.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Game not found" },
              })
            );
            break;
          }

          if (games[gameCode].players.length >= 2) {
            connection.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Game is full" },
              })
            );
            break;
          }

          if (
            games[gameCode].players.some((player) => player.id === playerID)
          ) {
            connection.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Player already exists in the game" },
              })
            );
            break;
          }

          games[gameCode].players.push({ id: playerID, score: 0 });
          connection.send(
            JSON.stringify({
              type: "player-joined",
              payload: { gameCode, playerID },
            })
          );
          console.log(`Player ${playerID} joined game ${gameCode}`);
          break;
        }
        default:
          connection.send(
            JSON.stringify({
              type: "error",
              payload: { message: "Unknown message type" },
            })
          );
          break;
      }
    } catch {
      console.error("Error processing message: bad request format");
      connection.send(
        JSON.stringify({ type: "error", payload: { message: "Bad request" } })
      );
      connection.close();
    }
  });

  connection.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
