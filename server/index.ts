import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MAXROUNDS = 15;

app.use(cors());
app.use(express.json());

type Choice = "cooperate" | "defect";

interface Player {
  id: 1 | 2;
  lastMove?: Choice;
  score: number;
}

interface Game {
  code: string;
  players: Player[];
  currentRound: number;
  maxRounds: number;
  history: {
    p1: Choice;
    p2: Choice;
    result: [number, number];
  }[];
}

const games: Record<string, Game> = {};

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/create-game", (req: Request, res: Response) => {
  const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const newGame: Game = {
    code: gameCode,
    players: [
      {
        id: 1,
        score: 0,
      },
    ],
    currentRound: 1,
    maxRounds: MAXROUNDS,
    history: [],
  };

  games[gameCode] = newGame;
  res.json({ game: newGame });
});

app.post("/join-game", (req: Request, res: Response) => {
  const { code, playerID } = req.body as {
    code: string;
    playerID: 1 | 2;
  };

  const game = games[code];
  if (!game)
    return res.status(404).json({ success: false, error: "Game not found" });
  if (game.players.length >= 2)
    return res.status(400).json({ success: false, error: "Game is full" });

  game.players.push({
    id: playerID,
    score: 0,
  });

  res.json({ success: true, game: game, playerID: playerID });
});

const payoff = (a: Choice, b: Choice): [number, number] => {
  if (a === "cooperate" && b === "cooperate") return [3, 3];
  if (a === "cooperate" && b === "defect") return [0, 5];
  if (a === "defect" && b === "cooperate") return [5, 0];
  if (a === "defect" && b === "defect") return [0, 0];
  return [0, 0];
};

app.post("/move", (req: Request, res: Response) => {
  const { code, playerID, choice } = req.body as {
    code: string;
    playerID: 1 | 2;
    choice: Choice;
  };

  const game = games[code];
  if (!game)
    return res.status(404).json({ success: false, error: "Game not found" });

  const player = game.players.find((p) => p.id === playerID);
  if (!player)
    return res.status(400).json({ success: false, error: "Player not found" });

  if (player.lastMove)
    return res
      .status(400)
      .json({ success: false, error: "You have already moved" });
  player.lastMove = choice;

  if (game.players.length == 2 && game.players.every((p) => p.lastMove)) {
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

  res.json({ game });
});

app.get("/game-state", (req: Request, res: Response) => {
  const code = String(req.query.code);
  const game = games[code];
  if (!game)
    return res.status(404).json({ success: false, error: "Game not found" });
  res.json({ game });
});
