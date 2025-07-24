import { Choice, games, payoff } from './_db';


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

    const { code, playerID, choice } = req.body as {
        code: string;
        playerID : 1 | 2;
        choice: Choice;
    };

    const game = games[code];
    if (!game) return res.status(404).json( { success: false, error: 'Game not found'});

    const player = game.players.find(p => p.id === playerID);
    if (!player) return res.status(400).json( { success: false, error: 'Player not found' } );

    if (player.lastMove) return res.status(400).json( { success: false, error: 'You have already moved' } );
    player.lastMove = choice;

    if (game.players.length == 2 && game.players.every(p => p.lastMove)) {
        const [p1, p2] = game.players;
        const [score1, score2] = payoff(p1.lastMove!, p2.lastMove!);
        p1.score += score1;
        p2.score += score2;
        
        game.history.push({
            p1: p1.lastMove!,
            p2: p2.lastMove!,
            result: [p1.score, p2.score]
        });

        game.currentRound++;
        game.players.forEach(p => delete p.lastMove);
    }

    res.json({game});
}