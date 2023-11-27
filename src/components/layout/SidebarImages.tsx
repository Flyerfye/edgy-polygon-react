import React from "react"
import classes from "./SidebarImages.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SidebarImages(props: any) {
  return <div className={classes.sidebarImages}>{props.children}</div>;
}
