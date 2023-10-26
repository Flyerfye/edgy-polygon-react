import classes from "./MainImage.module.css";

export default function MainImage(props: any) {
  return <main className={classes.main}>{props.children}</main>;
}
