import classes from "./ImagePanel.module.css";

export default function ImagePanel(props: any) {
  return <div className={classes.div}>{props.children}</div>;
}
