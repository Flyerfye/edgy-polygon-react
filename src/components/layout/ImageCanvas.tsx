import { useRef, useEffect } from "react";
import classes from './ImageCanvas.module.css';

export default function ImageCanvas(props: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!props.imgElem) return;

    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d");

    canvas!.width = props.imgElem.width * props.resizeFactor;
    canvas!.height = props.imgElem.height * props.resizeFactor;
    context!.drawImage(props.imgElem, 0, 0, canvas!.width, canvas!.height);

  }, [props.imgElem, props.resizeFactor]);
  return (
    
    <div className={classes.div} id="imageCanvasDiv">
      <canvas className={classes.canvas} id="imageCanvasCanvas" ref={canvasRef}></canvas>
    </div>
  );
}
