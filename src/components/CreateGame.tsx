import { useNavigate } from "react-router-dom";
import type { Game } from "../../utilities/types";
import useWebSocket from "react-use-websocket";

const CreateGame = () => {
  const navigate = useNavigate();
  const WS_URL: string = "ws://localhost:4001";

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data) as {
          type: string;
          payload: { gameCode: string };
        };
        if (data.type === "game-created") {
          const { gameCode } = data.payload;
          navigate("/game", {
            state: {
              game: {
                code: gameCode,
                players: [],
                currentRound: 1,
                maxRounds: 15,
                history: [],
              } as Game,
              playerID: 1,
            },
          });
        }
      } catch {
        console.error("Failed to parse message:", event.data);
      }
    },
  });

  const handleCreate = () => {
    sendJsonMessage({ type: "create-game" });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateGame;
