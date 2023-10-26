import classes from "./PolyCanvas.module.css";

export default function PolyCanvas(props: any) {
  return (
    <div>
      <div className={classes.polyCanvasDiv} id="polyCanvasDiv">
        <canvas />
      </div>
      <div className={classes.polyCanvasHiddenDiv} id="polyCanvasHiddenDiv">
        <canvas />
      </div>
    </div>
  );
}
