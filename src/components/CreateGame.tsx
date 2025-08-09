import { useNavigate } from "react-router-dom";

const CreateGame = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/lobby", {
      state: {
          playerID: 1,
      },
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateGame;
