import { useNavigate } from "react-router-dom";
import type { Game } from "../../utilities/types";
import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import type { GameCreatedMessage } from "../../utilities/messages";

const CreateGame = () => {
  const navigate = useNavigate();

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<GameCreatedMessage>(
    "wss://dilema-production.up.railway.app",
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
            players: [
              {
                id: 1,
                score: 0,
              },
            ],
            currentRound: 1,
            maxRounds: 15,
            history: [],
          } as Game,
          playerID: 1,
        },
      });
    }
  }, [lastJsonMessage, navigate]);

  return (
    <div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateGame;
