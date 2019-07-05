import React from 'react';

import styles from './App.module.scss';
import Board from './components/Board/Board';
import Data from './components/Data/Data';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Data playerScore={0} cpuScore={0} />
      <Board />
    </div>
  );
};

export default App;
