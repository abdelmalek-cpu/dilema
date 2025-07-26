import { useNavigate } from "react-router-dom";
import type { Game } from "../../utilities/types";
import useWebSocket from "react-use-websocket";
import { useEffect } from "react";

const CreateGame = () => {
  const navigate = useNavigate();

  interface GameCreatedMessage {
    type: string;
    payload: {
      gameCode: string;
    };
  }

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<GameCreatedMessage>(
    "ws://localhost:4001",
    {
      share: true,
      shouldReconnect: () => true,
    }
  );

  const handleCreate = () => {
    sendJsonMessage({
      type: "create-game",
    });
  };

  useEffect(() => {
    if (lastJsonMessage?.type === "game-created") {
      const { gameCode } = lastJsonMessage.payload;
      navigate("/game", {
        state: {
          game: {
            code: gameCode,
            players: [{
              id: 1,
              score:0
            }],
            currentRound: 1,
            maxRounds: 15,
            history: [],
          } as Game,
          playerID: 1,
        },
      });
    }
  }, [lastJsonMessage, navigate ]);


  return (
    <div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateGame;
