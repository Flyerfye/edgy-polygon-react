import classes from './ImagePanel.module.css';
import React from 'react';

export default function ImagePanel(props:any) {
  return (
      <div className={classes.div}>
        <main className={classes.main}>
          {props.children}
        </main>
      </div>
  );
}
