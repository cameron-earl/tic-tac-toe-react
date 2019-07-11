import React, { useState } from 'react';

import styles from './DropDownSelect.module.scss';

type DropdownSelectProps = {
  onSelect: (newValue: any) => void;
  value: any;
  options: { [key: string]: any };
};

const DropdownSelect = ({ onSelect, value, options }: DropdownSelectProps) => {
  const [isOpen, setOpen] = useState(false);
  const currentEntry = Object.entries(options).find(entry => entry[1] === value);
  const currentString = currentEntry ? currentEntry[0] : '';

  const toggleOpen = () => setOpen(!isOpen);
  return (
    <div className={styles.input} onClick={() => toggleOpen()}>
      {currentString}
      <div className={styles['arrow-down']} />
      {isOpen && (
        <div className={styles.options}>
          {Object.entries(options).map(entry => (
            <div key={entry[0] + entry[1]} className={styles.option} onClick={() => onSelect(entry[1])}>
              {entry[0]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
