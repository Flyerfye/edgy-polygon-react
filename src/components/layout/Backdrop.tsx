import React from "react";
import classes from "./Backdrop.module.css";

interface BackdropProps {
  onClick: () => void;
}

export default function Backdrop(props: BackdropProps) {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
}
