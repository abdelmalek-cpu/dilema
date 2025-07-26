import { useNavigate } from 'react-router-dom';
import type { Game } from '../../utilities/types';
import useWebSocket from 'react-use-websocket';

const CreateGame = () => {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket('ws://localhost:4001');
  
  // we use websocket to communicate with the server instead of fetch 

  const handleCreate = async () => {
    sendMessage(JSON.stringify({ type: 'create-game' }));
  };
  useWebSocket('ws://localhost:4001', {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'game-created') {
        const gameCode: string = data.payload.gameCode;
        console.log(`Game created with code: ${gameCode}`);
        navigate(`/game/${gameCode}`);
      } else if (data.type === 'error') {
        console.error(data.payload.message);
      }
    },
  });
  
  return (
    <div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateGame;