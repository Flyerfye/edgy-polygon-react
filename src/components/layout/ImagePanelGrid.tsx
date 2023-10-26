import classes from "./ImagePanelGrid.module.css";

export default function ImagePanelGrid(props: any) {
  return <main className={classes.main}>{props.children}</main>;
}
