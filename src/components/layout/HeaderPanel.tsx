import React from "react";
import classes from "./HeaderPanel.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeaderPanel(props: any) {
  return <main className={classes.headerPanel}>{props.children}</main>;
}
