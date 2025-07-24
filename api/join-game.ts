import { games } from './_db.js';

export default function handler(req: any, res: any) {


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }


    const { code, playerID } = req.body as {
        code: string;
        playerID: 1 | 2;
    };

    const game = games[code];
    if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
    if (game.players.length >= 2) return res.status(400).json({ success: false, error: 'Game is full' });

    game.players.push({
        id: playerID,
        score: 0
    });

    res.json( {success: true, game: game, playerID: playerID} );
};