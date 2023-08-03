import classes from './ControlsPanel.module.css';

export default function ControlsPanel(props:any) {
    return (
        <div>
          <main className={classes.main}>{props.children}</main>
        </div>
    );
}
