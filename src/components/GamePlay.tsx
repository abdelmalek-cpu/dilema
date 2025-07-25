import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MOVE_COLOR: Record<Choice, string> = {
  cooperate: 'green',
  defect: 'red'
};

type Choice = 'cooperate' | 'defect';

interface Game {
  code: string;
  players: {
    id: 1 | 2;
    name: string;
    score: number;
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


const GamePlay = () => {    
    const location = useLocation();
    const navigate = useNavigate();

    const {game: initialGame, playerID} = location.state as { game: Game; playerID: 1 | 2 };
    
    const [game, setGame] = useState<Game>(initialGame);
    const [error, setError] = useState<string | null>(null);
    const code = game.code;
    const me = game.players.find( p => p.id === playerID );
    const opponent = game.players.find( p => p.id !== playerID );

    useEffect(() => {
        const iv = setInterval( async () => {
            try {
                const res = await fetch(`https://dilema-production.up.railway.app/game-state?code=${code}`);
                const { game: updatedGame } = await res.json();
                setGame(updatedGame);
                console.log('Game state updated:', updatedGame);
            } catch {
                setError('Failed to fetch game state');
            }
        }, 2000);

        return () => clearInterval(iv);
    }, [code]);


    const handleMove = async (choice: Choice) => {
        setError(null);

        try {
            const res = await fetch(`https://dilema-production.up.railway.app/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, playerID, choice })
            });

            const payload = await res.json();
            if (!res.ok) {
                throw new Error(payload.error || 'Failed to make move');
            }
            setGame(payload.game);
        } catch {
            setError('Failed to make move');
        }
    };

    if (game.currentRound > game.maxRounds) {
        const [score1, score2] = game.history[game.history.length - 1]?.result ?? [0, 0];

        let resultText = 'Its a tie!';
        let winner: 1 | 2 | null = null;

        if (me!.score > opponent!.score) {
            resultText = 'You won!';
            winner = playerID;
        } else if (me!.score < opponent!.score) {
            resultText = 'You lost!';
            winner = playerID === 1 ? 2 : 1;
        }

        return (
            <div>
                <h2>Game Over</h2>
                <p>Final Score - Player 1: {score1}, Player 2: {score2}</p>
                <p>{resultText}</p>
                {winner && <p>Winner: Player {winner}</p>}
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    const hasMoved = me?.lastMove !== undefined;

    return (    
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Prisoner's Dilemma</h2>
      <p>
        <strong>Game Code:</strong> {code} | <strong>Round:</strong> {game.currentRound}/
        {game.maxRounds}
      </p>
      <p>
        <strong>Your Score:</strong> {me!.score}{' '}
        | <strong>
          Opponent Score: {opponent?.score ?? '-'}
        </strong>
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!hasMoved ? (
        <div>
          <p>Choose your move:</p>
          <button onClick={() => handleMove('cooperate')} style={{ marginRight: 8 }}>
            Cooperate 🤝
          </button>
          <button onClick={() => handleMove('defect')}>Defect 😈</button>
        </div>
      ) : (
        <p>
          You chose <strong>{me.lastMove}</strong>. Waiting for your opponent…
        </p>
      )}

      <hr />
     
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'gray',
          padding: 8,
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }}
      >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <strong>YOU-</strong>
        <strong>OPPONENT-</strong>
        <strong>Score</strong>
      </div>

      {game.history.map((h, idx) => {
        const yourMove = playerID === 1 ? h.p1 : h.p2;
        const oppMove  = playerID === 1 ? h.p2 : h.p1;
        const [s1, s2] = h.result;
        const yourScore = playerID === 1 ? s1 : s2;
        const oppScore  = playerID === 1 ? s2 : s1;

        return (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 20px auto',
              alignItems: 'center',
              columnGap: 8,
              marginBottom: 4
            }}
          >
            <div
              title={yourMove}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: MOVE_COLOR[yourMove]
              }}
            />

            <div
              title={oppMove}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: MOVE_COLOR[oppMove]
              }}
            />

            <span style={{ fontSize: '0.9em' }}>
              {yourScore} - {oppScore}
            </span>
          </div>
        );
      })}
    </div>
        </div>
      );

}

export default GamePlay;