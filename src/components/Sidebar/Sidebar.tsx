import React, { useEffect } from 'react';

import { Player, PlayerArr, PlayerIndex } from '../../App';
import { cpus } from '../../utils/cpu';
import Button from '../Button/Button';
import DropdownSelect from '../DropDownSelect/DropdownSelect';
import styles from './Sidebar.module.scss';

type SidebarProps = {
  players: PlayerArr;
  playerScores: number[];
  playerNames: string[];
  message: string;
  isGameOver: boolean;
  newGame: () => void;
  handlePlayerChange: (newPlayer: Player, playerIndex: PlayerIndex) => void;
};

const Sidebar = ({
  playerScores,
  playerNames,
  message,
  isGameOver,
  newGame,
  handlePlayerChange,
  players,
}: SidebarProps) => {
  useEffect(() => {
    const handleKeypress = (ev: KeyboardEvent) => {
      if (isGameOver && ev.key === 'Enter') newGame();
    };
    document.addEventListener('keypress', handleKeypress);
    return () => document.removeEventListener('keypress', handleKeypress);
  }, [isGameOver]);

  const playerObj: { [key: string]: Player } = {
    'Player 2': null,
    ...cpus,
  };

  return (
    <div className={styles.data}>
      <h1>Tic Tac Toe</h1>
      <h3>Counts:</h3>
      <h4>
        {playerNames[0]}: {playerScores[0]}
      </h4>
      <h4>
        {players[1] ? 'CPU (' : ''}
        {
          <DropdownSelect
            value={players[1]}
            options={playerObj}
            onSelect={(player: Player) => handlePlayerChange(player, 1)}
          />
        }
        {players[1] ? ')' : ''}: {playerScores[1]}
      </h4>
      <h3>{message}</h3>
      {isGameOver && <Button onClick={() => newGame()}>New Game</Button>}
    </div>
  );
};

export default Sidebar;
