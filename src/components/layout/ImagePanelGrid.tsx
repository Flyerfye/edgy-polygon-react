import classes from "./ImagePanelGrid.module.css";

export default function ImagePanelGrid(props: any) {
  return <main className={classes.imagePanelGrid}>{props.children}</main>;
}
