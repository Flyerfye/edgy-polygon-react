import { useRef, useEffect } from "react";
import classes from "./ImageCanvas.module.css";

interface ImageCanvasProps {
  imgElem: HTMLImageElement | null;
  resizeFactor: number;
}

export default function ImageCanvas(props: ImageCanvasProps) {
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
    <canvas
      className={classes.imageCanvas}
      id="imageCanvas"
      ref={canvasRef}
    ></canvas>
  );
}
