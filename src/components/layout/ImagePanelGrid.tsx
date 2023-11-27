import React from "react";
import classes from "./ImagePanelGrid.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImagePanelGrid(props: any) {
  return <main className={classes.imagePanelGrid}>{props.children}</main>;
}
