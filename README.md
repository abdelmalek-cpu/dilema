# Prisoner's Dilemma Game

A real-time multiplayer implementation of the classic Prisoner's Dilemma game theory concept, built with WebSockets for instant communication between players.

## 🎮 Game Overview

The Prisoner's Dilemma is a fundamental game theory scenario where two players must choose to either "cooperate" or "defect" without knowing the other player's choice. The payoff matrix creates strategic tension between individual and collective interests.

### Payoff Matrix
- **Both Cooperate**: 3 points each
- **Both Defect**: 0 points each  
- **One Cooperates, One Defects**: Defector gets 5 points, Cooperator gets 0 points

## 🛠 Tech Stack

### Backend
- **Node.js** with TypeScript
- **WebSocket Server** (`ws` library)
- **Express.js** (dependencies suggest future REST API support)
- **HTTP Server** for WebSocket upgrade handling

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Vite** for development and building
- **CSS3** for styling

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
```bash
cd server
npm install
```

### Frontend Setup
```bash
cd src
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the WebSocket Server**:
```bash
cd server
npm run dev
```
The server will start on port 4000 (or `WS_PORT` environment variable).

2. **Start the React Frontend**:
```bash
cd src
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### Production Build

1. **Build the Frontend**:
```bash
cd src
npm run build
```

2. **Build the Backend**:
```bash
cd server
npm run build
```

## 🎯 How to Play

1. **Create a Game**: 
   - Click "Create" on the home page
   - Choose the number of rounds (1-100)
   - Share the generated game code with another player

2. **Join a Game**:
   - Click "Join" on the home page
   - Enter the 6-character game code
   - Wait for the game creator to start

3. **Make Your Moves**:
   - Each round, choose either "Cooperate 🤝" or "Defect 😈"
   - Points are awarded based on the payoff matrix
   - View your move history in the sidebar

4. **Game End**:
   - After all rounds are completed, see the final scores
   - The player with the highest total score wins

## 🏗 Project Structure

```
├── server/
│   ├── index.ts              # WebSocket server entry point
│   ├── utilities/
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── payoff.ts         # Payoff matrix logic
│   │   └── messages.ts       # WebSocket message types
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── CreateGame.tsx    # Game creation component
│   │   ├── JoinGame.tsx      # Game joining component
│   │   ├── Lobby.tsx         # Game setup lobby
│   │   └── GamePlay.tsx      # Main game interface
│   ├── App.tsx               # Main app component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
└── README.md
```

## 📚 Game Theory Resources

To learn more about the Prisoner's Dilemma:
- [Stanford Encyclopedia of Philosophy - Prisoner's Dilemma](https://plato.stanford.edu/entries/prisoner-dilemma/)
- [The Evolution of Cooperation by Robert Axelrod](https://en.wikipedia.org/wiki/The_Evolution_of_Cooperation)

---
