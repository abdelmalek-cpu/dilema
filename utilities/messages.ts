import type { Game } from "./types";

export interface GameCreatedMessage {
  type: string;
  payload: {
    game: Game;
  };
}

interface GameUpdatedMessage {
  type: "game-updated";
  payload: {
    game: Game;
  };
}

interface PlayerJoinedMessage {
  type: "player-joined";
  payload: {
    game: Game;
    playerID: number;
  };
}

interface ErrorMessage {
  type: "error";
  payload: {
    message: string;
  };
}

export type ServerMessage = GameUpdatedMessage | PlayerJoinedMessage | ErrorMessage;
