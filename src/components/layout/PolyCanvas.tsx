import { useEffect } from "react";

export default function PolyCanvas(props: any) {
  return (
    <div>
      <div className="polyCanvasClass" id="polyCanvas">
        <canvas id="polyCanvas" />
      </div>
    </div>
  );
}
