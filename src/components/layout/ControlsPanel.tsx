import classes from "./ControlsPanel.module.css";

export default function ControlsPanel(props: any) {
  return <main className={classes.main}>{props.children}</main>;
}
