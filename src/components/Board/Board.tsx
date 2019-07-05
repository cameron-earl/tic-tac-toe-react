import React, { useState } from 'react';

import SquareVal from '../../Types/SquareVal';
import styles from './Board.module.scss';
import Square from './Square/Square';

export default function Board() {
  // Declare a new state variable, which we'll call "count"
  const [squareVals, setSquareVals] = useState('_________');
  const [playerVal, setPlayerVal] = useState('X');

  const clickSquare = (i: number) => () => {
    console.log(`Clicked square ${i}!`);
    const newSquareVals = squareVals.slice(0, i) + playerVal + squareVals.slice(i + 1);
    setSquareVals(newSquareVals);
    setPlayerVal(playerVal === 'X' ? 'O' : 'X');
  };

  const squares = squareVals
    .split('')
    .map((val: string, i: number) => (
      <Square key={'square' + i} handleClick={clickSquare(i)} status={val as SquareVal} />
    ));

  return (
    <div className={styles.container}>
      <div className={styles.board}>{squares}</div>
    </div>
  );
}
