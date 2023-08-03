import classes from './ControlsPanelGrid.module.css';

export default function ControlsPanelGrid(props:any) {
    return (
        <div>
          <main className={classes.main}>{props.children}</main>
        </div>
    );
}
