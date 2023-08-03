import classes from './ImagePanel.module.css';
import React from 'react';

export default function ImagePanel(props:any) {
  function componentDidMount() {
    console.log('componentDidMount called' + props.panelName);
  }

  return (
      <div>
        <main className={classes.main}>
          {props.children}
        </main>
      </div>
  );
}
