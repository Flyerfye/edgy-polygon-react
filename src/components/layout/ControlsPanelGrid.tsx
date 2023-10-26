import classes from "./ControlsPanelGrid.module.css";

export default function ControlsPanelGrid(props: any) {
  return <main className={classes.controlsPanelGrid}>{props.children}</main>;
}
