import classes from "./ControlsPanel.module.css";

export default function ControlsPanel(props: any) {
  return <main className={classes.controlsPanel}>{props.children}</main>;
}
