import React from "react";
import classes from "./FooterPanel.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FooterPanel(props: any) {
  return (
    <div className={classes.divContainer}>
      <main className={classes.footerPanel}>{props.children}</main>
    </div>
  );
}
