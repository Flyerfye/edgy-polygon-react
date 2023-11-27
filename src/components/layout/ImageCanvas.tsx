import React, { useRef, useEffect } from "react";
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
    
    if (!canvas) {
      throw new Error("Provided image element is not defined");
    }

    const canvasContext = canvas.getContext("2d");
    
    if (!canvasContext) {
      throw new Error("Provided image element is not defined");
    }

    canvas.width = props.imgElem.width * props.resizeFactor;
    canvas.height = props.imgElem.height * props.resizeFactor;
    canvasContext.drawImage(props.imgElem, 0, 0, canvas.width, canvas.height);
  }, [props.imgElem, props.resizeFactor]);
  return (
    <canvas
      className={classes.imageCanvas}
      id="imageCanvas"
      ref={canvasRef}
    ></canvas>
  );
}
