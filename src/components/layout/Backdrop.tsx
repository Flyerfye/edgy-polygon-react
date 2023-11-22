import classes from "./Backdrop.module.css";

interface BackdropProps {
  onClick: any;
}

export default function Backdrop(props: BackdropProps) {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
}
