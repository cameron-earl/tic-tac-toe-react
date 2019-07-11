import classNames from 'classnames';
import React from 'react';

import { WinningCoords } from '../../../Types/WinningCoords';
import styles from './Slash.module.scss';

/*eslint no-fallthrough: 0*/
const diagPath = 'M 3,3 L 97,97';
const sidePath = 'M 3,16 L 97,16';
const middlePath = 'M 3,50 L 97,50';

type SlashProps = {
  winningSquares: null | WinningCoords;
};

const Slash = ({ winningSquares }: SlashProps) => {
  if (!winningSquares) return <div className={classNames(styles.slash, styles.hidden)} />;

  let rotClass = '';
  let path = '';

  const goesThroughMiddle = winningSquares[1].join('') === '11';
  if (goesThroughMiddle) {
    switch (winningSquares[0].join('')) {
      case '02':
        rotClass = styles.rot90;
      case '00':
        path = diagPath;
        break;
      case '01':
        rotClass = styles.rot90;
      case '10':
        path = middlePath;
        break;
    }
  } else {
    const stringCoord = winningSquares.join(';');
    path = sidePath;
    switch (stringCoord) {
      case '0,2;1,2;2,2':
        rotClass = styles.rot90;
        break;
      case '2,0;2,1;2,2':
        rotClass = styles.rot180;
        break;
      case '0,0;1,0;2,0':
        rotClass = styles.rot270;
        break;
    }
  }

  const svg = (
    <svg viewBox="0 0 100 100">
      <path d={path} />
    </svg>
  );

  const slashClass = classNames(styles.slash, rotClass);
  return <div className={slashClass}>{svg}</div>;
};

export default Slash;
