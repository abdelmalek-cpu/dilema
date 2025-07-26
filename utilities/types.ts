export type Choice = "cooperate" | "defect";

export interface Player {
  id: 1 | 2;
  lastMove?: Choice;
  score: number;
}

export interface Game {
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
