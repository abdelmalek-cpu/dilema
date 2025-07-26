import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import type { ServerMessage } from "../../utilities/messages";

const GAMECODELENGTH = 6;
const JoinGame = () => {
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "wss://dilema-production.up.railway.app",
    {
      share: true,
      shouldReconnect: () => true,
    }
  );

  const handleJoin = () => {
    setShowInput(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(e.target.value);
  };

  const handleSubmit = () => {
    sendJsonMessage({
      type: "join-game",
      payload: {
        gameCode: inputCode,
        playerID: 2,
      },
    });
  };

  useEffect(() => {
    const message = lastJsonMessage as ServerMessage | null;

    if (!message) return;

    if (message.type === "error") {
      alert(message.payload.message);
    }

    if (message.type === "player-joined") {
      navigate("/game", {
        state: {
          game: message.payload.game,
          playerID: message.payload.playerID,
        },
      });
    }
  }, [lastJsonMessage, navigate]);

  return (
    <div>
      {!showInput && <button onClick={handleJoin}>Join</button>}
      {showInput && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            value={inputCode}
            onChange={handleInputChange}
            placeholder="Enter game code..."
            maxLength={GAMECODELENGTH}
            style={{ marginRight: "0.5rem" }}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default JoinGame;
