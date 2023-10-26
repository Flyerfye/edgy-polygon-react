import classes from "./HeaderPanel.module.css";

export default function HeaderPanel(props: any) {
  return <main className={classes.headerPanel}>{props.children}</main>;
}
