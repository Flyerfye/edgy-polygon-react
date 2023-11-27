import React from "react";
import classes from "./ControlsPanel.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ControlsPanel(props: any) {
  return <main className={classes.controlsPanel}>{props.children}</main>;
}
