import React from "react";
import classes from "./MainImage.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MainImage(props: any) {
  return <main className={classes.mainImage}>{props.children}</main>;
}
