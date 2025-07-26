export type Choice = 'cooperate' | 'defect';

export interface Game {
  code: string;
  players: {
    id: 1 | 2;    score: number;
    lastMove?: Choice;
  }[];
  currentRound: number;
  maxRounds: number;
  history: {
    p1: Choice;
    p2: Choice;
    result: [number, number];
  }[];
}

export interface Player {
    id : 1 | 2;
    lastMove? : Choice
    score : number;
};
