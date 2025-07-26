import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import GamePlay from "./components/GamePlay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Prisoner's Dilema Game</h1>
              <div className="game_control">
                <CreateGame />
                <JoinGame />
              </div>
              <p style={{ color: "grey" }}>
                If you have a game code press the JoinGame button.
              </p>
            </>
          }
        />
        <Route path="/game" element={<GamePlay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
