import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import type { GameCreatedMessage } from "../../utilities/messages";

const Lobby = () => {
  const navigate = useNavigate();
  const [inputNumber, setInputNumber] = useState(1);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<GameCreatedMessage>(
    "ws://localhost:4001",
    {
      share: true,
      shouldReconnect: () => true,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 100) {
      setInputNumber(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({
      type: "create-game",
      payload: {
        rounds: inputNumber,
      },
    });
  };

  useEffect(() => {
    if (lastJsonMessage?.type === "game-created") {
      const { game } = lastJsonMessage.payload;
      navigate("/game", {
        state: {
          game: game,
          playerID: 1,
        },
      });
    }
  }, [lastJsonMessage, navigate]);

  return (
    <div>
      <h2>Game Lobby</h2>
      <p>Please specify the number of Rounds</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          max="100"
          value={inputNumber}
          onChange={handleInputChange}
          style={{ width: "100px" , marginRight: "20px" }}
        />
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

export default Lobby;
