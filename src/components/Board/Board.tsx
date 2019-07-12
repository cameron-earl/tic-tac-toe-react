import React, { useEffect } from 'react';

import { GameArray, Line } from '../../Types/GameArray';
import { SquareVal, XO } from '../../Types/SquareVal';
import { lineIndex } from '../../Types/WinningCoords';
import { isGameOver, nextMove, updateGameArr } from '../../utils/gameUtils';
import styles from './Board.module.scss';
import Slash from './Slash/Slash';
import Square from './Square/Square';

type BoardProps = {
  gameArr: GameArray;
  setGameArr: (arg0: GameArray) => void;
};

const Board = ({ gameArr, setGameArr }: BoardProps) => {
  const gameOver = !gameArr ? null : isGameOver(gameArr);
  useEffect(() => {
    const handleKeyPress = (ev: KeyboardEvent) => {
      if (!gameArr || gameOver) return;
      if (/^[1-9]$/.test(ev.key)) {
        const n = +ev.key - 1;
        const r = (2 - Math.floor(n / 3)) as lineIndex;
        const c = (n % 3) as lineIndex;
        clickSquare(r, c)();
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [gameArr, gameOver]);

  if (!gameArr) return null;
  const winningSquares = gameOver ? gameOver[1] : null;
  const currentSymbol = nextMove(gameArr);

  const clickSquare = (r: lineIndex, c: lineIndex) => () => {
    const newGameArr = updateGameArr(gameArr, r, c, currentSymbol as XO);
    setGameArr(newGameArr);
  };

  const squares = gameArr.map((row: Line, r: number) =>
    row.map((val: string, c: number) => (
      <Square
        key={'square' + (r * 3 + c)}
        gameOver={!!gameOver}
        handleClick={clickSquare(r as lineIndex, c as lineIndex)}
        status={val as SquareVal}
      />
    ))
  );

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {squares}
        <Slash winningSquares={winningSquares} />
      </div>
    </div>
  );
};

export default Board;
