import { useNavigate } from 'react-router-dom';


type Choice = 'cooperate' | 'defect';

interface Player {
    id : 1 | 2;
    lastMove? : Choice
    score : number;
};

interface Game {
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

const CreateGame = () => {
  const navigate = useNavigate();


  const handleCreate = async () => {
    const response = await fetch('/api/create-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const data: { game: Game } = await response.json();

    navigate('/game', { state: { game: data.game , playerID: 1} });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateGame;