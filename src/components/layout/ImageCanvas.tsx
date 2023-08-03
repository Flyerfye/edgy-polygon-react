import React, { useRef, useEffect } from "react";

export default function ImageCanvas(props: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!props.imgElem) return;
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d");

    canvas!.width = props.imgElem.width;
    canvas!.height = props.imgElem.height;
    context!.drawImage(
      props.imgElem,
      0,
      0,
      props.imgElem.width,
      props.imgElem.height
    );
  });

  return (
    <div>
      <canvas id="imageCanvas" ref={canvasRef}></canvas>
    </div>
  );
}
