export type Choice = 'cooperate' | 'defect';

export interface Player {
    id : 1 | 2;
    lastMove? : Choice
    score : number;
};

export interface Game {
    code: string;
    players: Player[];
    currentRound: number;
    maxRounds: number;
    history: {
        p1: Choice;
        p2: Choice;
        result: [number, number];
    }[]
};

export const games: Record<string, Game> = {};
export const MAXROUNDS = 15;

export const payoff = (a: Choice, b: Choice) : [number, number] => {
    if (a === 'cooperate' && b === 'cooperate') return [3, 3];
    if (a === 'cooperate' && b === 'defect') return [0, 5];
    if (a === 'defect' && b === 'cooperate') return [5, 0];
    if (a === 'defect' && b === 'defect') return [0, 0];
    return [0, 0];
}