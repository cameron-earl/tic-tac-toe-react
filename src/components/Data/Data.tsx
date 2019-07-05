import React from 'react';

import styles from './Data.module.scss';

type DataProps = {
  playerScore: number;
  cpuScore: number;
};

const Data = ({ playerScore, cpuScore }: DataProps) => {
  return (
    <div className={styles.data}>
      <h1>Tic Tac Toe</h1>
      <h3>Counts:</h3>
      <h4>You: {playerScore}</h4>
      <h4>CPU: {cpuScore}</h4>
    </div>
  );
};

export default Data;
