import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Choice, Game } from "../utilities/types";
import payoff from "../utilities/payoff";

const server = http.createServer();
const PORT = process.env.WS_PORT || 4001;
const MAXROUNDS = 15;
const wsServer = new WebSocketServer({ server });

const games: Record<string, Game> = {};
const connections: Map<WebSocket, { gamecode: string; playerID: number }> =
  new Map();

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
  console.log("New client connected");
  connection.send(
    JSON.stringify({
      type: "welcome",
      message: "Welcome to the game server!",
    })
  );

  connection.on("message", (message) => {
    const data = JSON.parse(message.toString());
    try {
      switch (data.type) {
        case "create-game": {
          const gameCode: string = createGame();
          connections.set(connection, { gamecode: gameCode, playerID: 1 });
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
          connections.set(connection, { gamecode: gameCode, playerID });
          connection.send(
            JSON.stringify({
              type: "player-joined",
              payload: { game: games[gameCode], playerID },
            })
          );
          console.log(`Player ${playerID} joined game ${gameCode}`);

          for (const [conn, info] of connections.entries()) {
            if (conn !== connection && info.gamecode === gameCode) {
              conn.send(
                JSON.stringify({
                  type: "game-updated",
                  payload: { game: games[gameCode] },
                })
              );
              console.log("Game updated");
            }
          }

          break;
        }

        case "identify": {
          const { gameCode, playerID } = data.payload;
          connections.set(connection, { gamecode: gameCode, playerID });
          
          break;
        }

        case "move": {
          const {
            gameCode,
            playerID,
            move,
          }: { gameCode: string; playerID: number; move: Choice } =
            data.payload;

          const game = games[gameCode];
          const player = game.players.find((p) => p.id === playerID);
          if (!game) {
            connection.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Game not found" },
              })
            );
          }

          if (!player) {
            connection.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Game not found" },
              })
            );
          }

          if (player!.lastMove) {
            connection.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Player already moved" },
              })
            );
          }

          player!.lastMove = move;

          if (
            game.players.length == 2 &&
            game.players.every((p) => p.lastMove!)
          ) {
            const [p1, p2] = game.players;
            const [score1, score2] = payoff(p1.lastMove!, p2.lastMove!);
            p1.score += score1;
            p2.score += score2;

            game.history.push({
              p1: p1.lastMove!,
              p2: p2.lastMove!,
              result: [p1.score, p2.score],
            });

            game.currentRound++;

            game.players.forEach((p) => delete p.lastMove);
          }

          for (const [conn, info] of connections.entries()) {
            if (info.gamecode === gameCode) {
              conn.send(
                JSON.stringify({
                  type: "game-updated",
                  payload: { game: games[gameCode] },
                })
              );
              console.log("Game updated");
            }
          }

          break;
        }

        default: {
          connection.send(
            JSON.stringify({
              type: "error",
              payload: { message: "Unknown message type" },
            })
          );
          break;
        }
      }
    } catch (error) {
      console.error("Error processing message: bad request format");
      connection.send(
        JSON.stringify({ type: "error", payload: { message: "Bad request" } })
      );
      console.log(error);
      connection.close();
      connections.delete(connection);
    }
  });

  connection.on("close", () => {
    console.log("Client disconnected");
    connections.delete(connection);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
