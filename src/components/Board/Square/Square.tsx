import classNames from 'classnames';
import React from 'react';

import SquareVal from '../../../Types/SquareVal';
import O from './O';
import styles from './Square.module.scss';
import X from './X';

type SquareProps = {
  handleClick: Function;
  status: SquareVal;
};

const Square = ({ handleClick, status }: SquareProps) => {
  const isBlank = status === '_';

  const squareClass = classNames({
    [styles.square]: true,
    [styles.clickable]: isBlank,
  });

  const content = isBlank ? <div className={styles.empty} /> : status === 'X' ? <X /> : <O />;

  return (
    <div className={squareClass} onClick={() => isBlank && handleClick()}>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default Square;
