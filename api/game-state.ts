import { games } from './_db.js';


export default function handler(req: any, res: any) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    const code = String(req.query.code);
    const game = games[code];
    if (!game) return res.status(404).json( { success: false, error: 'Game not found' } );
    res.json({ game });
}