import classNames from 'classnames';
import React from 'react';

import { SquareVal } from '../../../Types/SquareVal';
import O from './O';
import styles from './Square.module.scss';
import X from './X';

type SquareProps = {
  handleClick: Function;
  status: SquareVal;
  gameOver: boolean;
};

const Square = ({ handleClick, status, gameOver }: SquareProps) => {
  const isBlank = status === '_';

  const squareClass = classNames({
    [styles.square]: true,
    [styles.clickable]: isBlank && !gameOver,
  });

  const content = isBlank ? <div className={styles.empty} /> : status === 'X' ? <X /> : <O />;

  return (
    <div className={squareClass} onClick={() => isBlank && !gameOver && handleClick()}>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default Square;
