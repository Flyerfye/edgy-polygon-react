import React from "react";
import classes from "./ImagePanel.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImagePanel(props: any) {
  return <div className={classes.imagePanel}>{props.children}</div>;
}
