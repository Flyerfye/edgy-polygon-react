import Delaunay from "delaunay-fast";

interface RenderPolygonFnProps {
  imgElem: HTMLImageElement | null;
  polygonResizeFactor: number;
  borderPoints: number;
  colorSampRadius: number;
  showPoints: boolean;
  saveImage: boolean;
  points: number[][];
  onSuccess: (arg1: HTMLCanvasElement) => void;
}

export function RenderPolygonFn(opts: RenderPolygonFnProps) {
  opts.borderPoints = opts?.borderPoints || defaults.borderPoints;

  opts.showPoints = opts?.showPoints || defaults.showPoints;

  opts.colorSampRadius = opts?.colorSampRadius || defaults.colorSampRadius;

  if (!opts.imgElem) {
    throw new Error("Provided image element is not defined");
  }
  const canvas = polygonizeFromPts(opts.imgElem, opts.saveImage);

  if (opts.onSuccess) {
    opts.onSuccess(canvas);
  }

  function polygonizeFromPts(image: HTMLImageElement, saveImage: boolean) {
    const outputCanvas: HTMLCanvasElement = document.createElement("canvas");
    const tempCtx: CanvasRenderingContext2D | null = outputCanvas?.getContext("2d");
    if (!tempCtx) {
      throw new Error("Canvas rendering context cannot be null or undefined");
    }
    const ctx: CanvasRenderingContext2D = tempCtx;


    const canvas = document.createElement("canvas");
    const points = opts.points;

    const imageWidth = +image.width * opts.polygonResizeFactor;
    const imageHeight = +image.height * opts.polygonResizeFactor;

    outputCanvas.id = "polyCanvas";

    if (saveImage) {
      outputCanvas.id = "hiddenPolyCanvas";
    }

    outputCanvas.width = imageWidth;
    outputCanvas.height = imageHeight;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    const canvasContext = canvas.getContext("2d", { willReadFrequently: true });
    canvasContext?.drawImage(image, 0, 0, imageWidth, imageHeight);

    //add bounding points for the edges
    //points added to the overall array are not referenced as x, y but rather as row, col which may seem inverted
    if (opts.borderPoints > 0) {
      let points_i = points.length;

      // points in the 4 corners of the image
      points[points_i++] = [0, 0];
      points[points_i++] = [0, imageWidth - 0];
      points[points_i++] = [imageHeight - 0, 0];
      points[points_i++] = [imageHeight - 0, imageWidth - 0];

      // points along the edges
      for (let i = 1; i < opts.borderPoints; i++) {
        points[points_i++] = [0, 0 + imageWidth / (i + 1)];
        points[points_i++] = [0 + imageHeight / (i + 1), 0];
        points[points_i++] = [imageHeight / (i + 1), imageWidth - 0];
        points[points_i++] = [imageHeight - 0, imageWidth / (i + 1)];
      }
    }

    const indices = Delaunay.triangulate(points);

    //NOTE this operation is very resource hungry and blocks the single thread
    for (let index = 0; index < indices.length; index += 3) {
      const triangle = [
        indices[index],
        indices[index + 1],
        indices[index + 2],
      ].map(function (index) {
        return [points[index][1], points[index][0]];
      });

      const centerX = Math.round(
        (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3
      );
      const centerY = Math.round(
        (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3
      );

      const colorArray: Uint8ClampedArray[] = [];

      // if any smoothing is to be performed, queue up pixels to be smoothed in square selection around the center pixel
      if (opts.colorSampRadius > 0) {
        const smoothDist = +opts.colorSampRadius;

        for (
          let x_smooth = 0 > centerX - smoothDist ? 0 : centerX - smoothDist;
          x_smooth <
          (imageWidth < centerX + smoothDist
            ? imageWidth
            : centerX + smoothDist);
          x_smooth++
        ) {
          for (
            let y_smooth = 0 > centerY - smoothDist ? 0 : centerY - smoothDist;
            y_smooth <
            (imageHeight < centerY + smoothDist
              ? imageHeight
              : centerY + smoothDist);
            y_smooth++
          ) {
            colorArray.push(
              getPixel(canvas, x_smooth, centerY, imageWidth, imageHeight)
            );
          }
        }
      } else {
        colorArray.push(
          getPixel(canvas, centerX, centerY, imageWidth, imageHeight)
        );
      }

      drawTriangle(triangle, averagePixels(colorArray), ctx);

      // //useful for seeing where the centroid of the delaunay points are placed
      // let tempfillStyle = ctx.fillStyle;
      // ctx.fillStyle = "black";
      // ctx.fillRect(centerX, centerY, 1, 1);
      // ctx.fillStyle = tempfillStyle;
    }

    if (opts.showPoints) {
      for (let ptsIndex = 0; ptsIndex < indices.length; ptsIndex += 3) {
        const triangle = [
          indices[ptsIndex],
          indices[ptsIndex + 1],
          indices[ptsIndex + 2],
        ].map(function (ptsIndex) {
          return points[ptsIndex];
        });

        drawEndPoints(triangle, ctx);
      }
    }

    return outputCanvas;
  }
}

const defaults = {
  borderPoints: 1,
  showPoints: false,
  colorSampRadius: 0,
};

function componentToHex(c: number): string {
  const hex = c.toString(16);
  if (hex.length === 1) {
    return "0" + hex;
  }
  return hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getPixel(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
): Uint8ClampedArray {
  // correct for cases where the pixel is only a fraction outside of the canvas area in the neg dir
  x = Math.floor(Math.abs(x));
  y = Math.floor(Math.abs(y));
  // check if the pixel is within image bounds before querying/returning it
  if (x >= 0 && x <= maxWidth && y >= 0 && y <= maxHeight) {
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) {
      throw new Error("Provided image element is not defined");
    }
    return canvasContext.getImageData(x, y, 1, 1).data;
  } else {
    // if the pixel is outside of bounds, return an invalid color
    console.log("Pixel out of bounds: (" + x + "," + y + ")");
    return new Uint8ClampedArray([-1, -1, -1, 0]);
  }
}

function averagePixels(pixels: Uint8ClampedArray[]): string {
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  //iterate through each pixel
  for (let i = 0; i < pixels.length; i++) {
    // if the pixel is not transparent, use it for determining average color
    if (pixels[i][3] !== 0) {
      red += pixels[i][0];
      green += pixels[i][1];
      blue += pixels[i][2];
      count++;
    }
  }

  return rgbToHex(
    Math.round(red / count),
    Math.round(green / count),
    Math.round(blue / count)
  );
}

function drawTriangle(
  triangle: number[][],
  color: string,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(triangle[0][0], triangle[0][1]);
  ctx.lineTo(triangle[1][0], triangle[1][1]);
  ctx.lineTo(triangle[2][0], triangle[2][1]);

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.fill();
  ctx.stroke();
}

function drawEndPoints(triangle: number[][], ctx: CanvasRenderingContext2D) {
  const tempfillStyle = ctx.fillStyle;
  ctx.fillStyle = "white";
  ctx.fillRect(triangle[0][1], triangle[0][0], 1, 1);
  ctx.fillRect(triangle[1][1], triangle[1][0], 1, 1);
  ctx.fillRect(triangle[2][1], triangle[2][0], 1, 1);
  ctx.fillStyle = tempfillStyle;
}
