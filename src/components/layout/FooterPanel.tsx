import classes from "./FooterPanel.module.css";

export default function FooterPanel(props: any) {
  return (
    <div className={classes.divContainer}>
      <main className={classes.footerPanel}>{props.children}</main>
    </div>
  );
}
