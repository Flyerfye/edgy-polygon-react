import classes from "./PolyCanvas.module.css";

export default function PolyCanvas() {
  return (
    <div>
      <div className={classes.polyCanvasDiv} data-testid='polygon-canvas' id="polyCanvasDiv"  >
        <canvas />
      </div>
      <div className={classes.polyCanvasHiddenDiv} id="polyCanvasHiddenDiv">
        <canvas />
      </div>
    </div>
  );
}
