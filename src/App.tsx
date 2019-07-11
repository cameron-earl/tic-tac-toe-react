import React, { useState } from 'react';

import styles from './App.module.scss';
import Board from './components/Board/Board';
import Sidebar from './components/Sidebar/Sidebar';
import { newGameArray } from './Types/GameArray';
import { XO } from './Types/SquareVal';
import { CPU, cpus } from './utils/cpu';
import { isGameOver, nextMove } from './utils/gameUtils';

export type Player = CPU | null; // null indicates human
export type PlayerArr = [Player, Player];
export type PlayerIndex = 0 | 1;

const App: React.FC = () => {
  const [gameArr, setGameArr] = useState(newGameArray());
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [firstPlayer, setFirstPlayer] = useState(0 as PlayerIndex);
  const getStartMessage = (): string => 'You are ' + ['X', 'O'][firstPlayer];
  const [message, setMessage] = useState(getStartMessage());
  const [players, setPlayers] = useState([null, cpus.easy] as PlayerArr);
  const [gameOverHandled, setGameOverHandled] = useState(false);
  const [gameCount, setGameCount] = useState(0);

  const getPlayerIndexFromSymbol = (s: XO) => (s === 'X' ? firstPlayer : (+!firstPlayer as PlayerIndex));

  let playerNames = players.map(val => (val ? val.name : 'Player'));
  if (playerNames[0] === playerNames[1]) playerNames = playerNames.map((name, i) => `${name} ${i + 1}`);

  const gameOver = isGameOver(gameArr);

  const resetGame = () => {
    setMessage('You are ' + ['O', 'X'][firstPlayer]);
    setFirstPlayer(+!firstPlayer as 0 | 1);
    setGameArr(newGameArray());
    setGameOverHandled(false);
  };

  const autoPlayCPUS = () => {
    const maxGameCount = 1000;
    if (players[0] && players[1] && gameCount <= maxGameCount) {
      setTimeout(resetGame, 0);
    }
  };

  const handlePlayerChange = (newPlayer: Player, playerIndex: PlayerIndex) => {
    setPlayers([playerIndex === 0 ? newPlayer : players[0], playerIndex === 1 ? newPlayer : players[1]]);
    setPlayerScores([0, 0]);
    setGameCount(0);
    resetGame();
    setFirstPlayer(0);
  };

  if (gameOver && !gameOverHandled) {
    if (gameOver[0] === '_') {
      setMessage('Tie!');
    } else {
      const winner = getPlayerIndexFromSymbol(gameOver[0]);
      const newPlayerScores = [...playerScores];
      newPlayerScores[winner]++;
      setPlayerScores(newPlayerScores);
      setMessage(playerNames[winner] + ' wins!');
    }
    setGameCount(gameCount + 1);
    setGameOverHandled(true);
    autoPlayCPUS();
  } else if (!gameOver) {
    const currentSymbol = nextMove(gameArr) as XO;
    const currentPlayerIndex = getPlayerIndexFromSymbol(currentSymbol);
    if (players[currentPlayerIndex]) {
      setGameArr((players[currentPlayerIndex] as CPU).makeMove(gameArr));
    }
  }

  return (
    <div className={styles.app}>
      <Sidebar
        players={players}
        playerScores={playerScores}
        playerNames={playerNames}
        message={message}
        isGameOver={!!gameOver}
        newGame={resetGame}
        handlePlayerChange={handlePlayerChange}
      />
      <Board gameArr={gameArr} setGameArr={setGameArr} />
    </div>
  );
};

export default App;
