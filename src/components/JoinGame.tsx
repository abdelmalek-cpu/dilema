import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GAMECODELENGTH = 6;
const JoinGame = () => {
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const handleJoin = () => {
    setShowInput(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(e.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch(
      `https://dilema-production.up.railway.app/join-game`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode, playerID: 2 }),
      }
    );
    const data = await response.json();
    if (data.success) {
      navigate("/game", { state: { game: data.game, playerID: 2 } });
    } else {
      alert(data.error || "Failed to join game");
    }
  };

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
