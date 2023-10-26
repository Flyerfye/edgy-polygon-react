import classes from "./FooterPanel.module.css";

export default function FooterPanel(props: any) {
  return (
    <div className={classes.divContainer}>
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}
