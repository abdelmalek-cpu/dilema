import {games, Game, MAXROUNDS} from './_db.js';

export default function handler(req: any, res: any) {


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }



    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGame: Game = {
        code: gameCode,
        players: [{
            id: 1,
            score: 0
        }],
        currentRound: 1,
        maxRounds: MAXROUNDS,
        history: []
    };

    games[gameCode] = newGame;
    res.json({ game: newGame });
}