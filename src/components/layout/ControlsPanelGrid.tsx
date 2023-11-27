import React from "react";
import classes from "./ControlsPanelGrid.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ControlsPanelGrid(props: any) {
  return <main className={classes.controlsPanelGrid}>{props.children}</main>;
}
