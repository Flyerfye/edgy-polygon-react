import classes from "./Backdrop.module.css";

export default function Backdrop(props) {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
}
