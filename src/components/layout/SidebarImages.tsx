import classes from "./SidebarImages.module.css";

export default function SidebarImages(props: any) {
  return <div className={classes.sidebarImages}>{props.children}</div>;
}
