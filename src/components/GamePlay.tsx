import { useLocation, useNavigate } from "react-router-dom";
import type { Choice, Game } from "../../utilities/types";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import type { ServerMessage } from "../../utilities/messages";

const MOVE_COLOR: Record<Choice, string> = {
  cooperate: "green",
  defect: "red",
};

const GamePlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { game: initialGame, playerID } = location.state as {
    game: Game;
    playerID: 1 | 2;
  };

  const [game, setGame] = useState<Game>(initialGame);

  const me = game.players.find((p) => p.id === playerID);
  const opponent = game.players.find((p) => p.id !== playerID);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:4001",
    {
      share: true,
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    sendJsonMessage({
      type: "identify",
      payload: {
        gameCode: game.code,
        playerID,
      },
    });
  }, [game.code, playerID, sendJsonMessage]);

  useEffect(() => {
    const message = lastJsonMessage as ServerMessage | null;

    if (!message) return;

    if (message?.type === "game-updated") {
      const updatedGame: Game = message.payload.game;
      setGame(updatedGame);
    }
    if (message?.type === "player-joined") {
      const updatedGame: Game = message.payload.game;
      setGame(updatedGame);
    }
    if (message?.type === "error") {
      setError(message.payload.message);
    }
  }, [lastJsonMessage]);

  const handleMove = (move: Choice) => {
    sendJsonMessage({
      type: "move",
      payload: {
        gameCode: game.code,
        playerID: playerID,
        move: move,
      },
    });
  };

  if (game.currentRound > game.maxRounds) {
    const [score1, score2] = game.history[game.history.length - 1]?.result ?? [
      0, 0,
    ];

    let resultText = "Its a tie!";
    let winner: 1 | 2 | null = null;

    if (me!.score > opponent!.score) {
      resultText = "You won!";
      winner = playerID;
    } else if (me!.score < opponent!.score) {
      resultText = "You lost!";
      winner = playerID === 1 ? 2 : 1;
    }

    return (
      <div>
        <h2>Game Over</h2>
        <p>
          Final Score - Player 1: {score1}, Player 2: {score2}
        </p>
        <p>{resultText}</p>
        {winner && (
          <p style={{ color: winner === playerID ? "green" : "red" }}>
            Winner: Player {winner}
          </p>
        )}
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const hasMoved = me?.lastMove !== undefined;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Prisoner's Dilemma</h2>
      <p>
        <strong>Game Code:</strong> {game.code} | <strong>Round:</strong>{" "}
        {game.currentRound}/{game.maxRounds}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!hasMoved ? (
        <div>
          <p>Choose your move:</p>
          <button
            onClick={() => handleMove("cooperate")}
            style={{ marginRight: 8 }}
          >
            Cooperate 🤝
          </button>
          <button onClick={() => handleMove("defect")}>Defect 😈</button>
        </div>
      ) : (
        <p>
          You choose <strong>{me.lastMove}</strong>. Waiting for your
          opponent...
        </p>
      )}
      <hr />

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "gray",
          padding: 8,
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <strong>You-</strong>
          <strong>Opponent-</strong>
          <strong>Score</strong>
        </div>

        {game.history.map((h, idx) => {
          const yourMove = playerID === 1 ? h.p1 : h.p2;
          const oppMove = playerID === 1 ? h.p2 : h.p1;
          const [s1, s2] = h.result;
          const yourScore = playerID === 1 ? s1 : s2;
          const oppScore = playerID === 1 ? s2 : s1;

          return (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 20px auto",
                alignItems: "center",
                columnGap: 8,
                marginBottom: 4,
              }}
            >
              <div
                title={yourMove}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: MOVE_COLOR[yourMove],
                }}
              />

              <div
                title={oppMove}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: MOVE_COLOR[oppMove],
                }}
              />

              <span style={{ fontSize: "0.9em" }}>
                {yourScore} - {oppScore}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamePlay;
