import React from 'react';
import styles from './unorderedList.css';

const UnorderedList = (props) => (
  <div className={styles.multiLineContainer}>
    {props.children}
   </div>);

export default UnorderedList;