import { useNavigate } from "react-router-dom";
import type { Game } from "../../utilities/types";

const CreateGame = () => {
  const navigate = useNavigate();

  const handleCreate = async () => {
    const response = await fetch(
      "https://dilema-production.up.railway.app/create-game",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    const data: { game: Game } = await response.json();

    navigate("/game", { state: { game: data.game, playerID: 1 } });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateGame;
