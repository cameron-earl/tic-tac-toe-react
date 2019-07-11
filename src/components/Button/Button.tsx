import React, { ReactNode } from 'react';

import styles from './Button.module.scss';

type ButtonProps = {
  onClick: (...args: any[]) => any;
  children: ReactNode;
};

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button className={styles.button} onClick={() => onClick()}>
      {children}
    </button>
  );
};

export default Button;
