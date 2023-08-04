import { RenderPolygonFn } from "../src/RenderPolygon";
import * as cv from "mirada/dist/src/opencv";

export function processImage(props: any): any {
  if (cv.getBuildInformation) {
    return processImageCallback(props);
  } else {
    // WASM
    cv["onRuntimeInitialized"] = () => {
      return processImageCallback(props);
    };
  }
}

// Perform edge detection and polyg calc and render
function processImageCallback(props: any): any {
  console.log("OpenCV is now ready, processing image");

  let cvSrc = cv.imread(props.imgElem);
  let cvDst = new cv.Mat();

  // convert the cv image to grayscale for edge detection
  cv.cvtColor(cvSrc, cvSrc, cv.COLOR_RGB2GRAY, 0);
  cv.Canny(
    cvSrc,
    cvDst,
    +props.edgeMinThreshold,
    +props.edgeMaxThreshold,
    3,
    false
  );

  if (+props.pointSpacing > 0)
    cvDst = generateSpacedMat(cvDst, +props.pointSpacing);
  if (+props.sparseness > 1)
    cvDst = generateSparseMat(cvDst, +props.sparseness);

  let dstPts = matToPoints(cvDst, props.pointsFn);

  cv.imshow("edgeCanvas", cvDst);
  cvSrc?.delete();
  cvDst.delete();

  RenderPolygonFn({
    points: dstPts,
    borderPoints: +props.borderPoints,
    colorSampRadius: +props.colorSampRadius,
    showPoints: props.showPoints,
    imgElem: props.imgElem,
    onSuccess: function (canvas: HTMLCanvasElement) {
      const polyCanvasDiv = document.getElementById("polyCanvas");
      polyCanvasDiv!.innerHTML = "";
      polyCanvasDiv!.appendChild(canvas);
    },
  });
}

// Filters the points in the image matrix based upon a specified minimum distance between px
export function generateSpacedMat(mat: any, dist: number): any {
  //get the dimensions of the Mat object
  var rows = mat.rows;
  var cols = mat.cols;
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols; y++) {
      var currentPixel = mat.charAt(x * cols + y);
      if (currentPixel !== 0) {
        //lazy erase a rectangle distance around the current point
        //not necessary to search up since we will always be erasing down first
        for (
          var erase_x = x;
          erase_x < (x + dist < rows ? x + dist : rows);
          erase_x++
        ) {
          for (
            var erase_y = y - dist > 0 ? y - dist : 0;
            erase_y < (y + dist < cols ? y + dist : cols);
            erase_y++
          ) {
            mat.data[erase_x * cols + erase_y] = 0;
          }
        }
        //lazy erase will also erase current px, restore it
        mat.data[x * cols + y] = currentPixel;
      }
    }
  }
  return mat;
}

// Creates a sparse matrix so users can see the sparsified edge image
export function generateSparseMat(mat: any, sparseness: any): any {
  //get the dimensions of the Mat object
  var rows = mat.rows;
  var cols = mat.cols;
  var sparseValue = +sparseness;

  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols; y++) {
      var currentPixel = mat.charAt(x * cols + y);
      if (currentPixel !== 0) {
        Math.floor(Math.random() * sparseness);
        if (
          mat.charAt(x * cols + y) !== 0 &&
          0 < Math.floor(Math.random() * sparseValue)
        ) {
          mat.data[x * cols + y] = 0;
        }
      }
    }
  }

  return mat;
}

// Converts the matrix of values returned from edge detection to an array of points
export function matToPoints(mat: any, pointsFn: any): number[][] {
  //get the dimensions of the Mat object
  var rows = mat.rows;
  var cols = mat.cols;
  var totalPoints = 0;

  var points: number[][] = [];
  //return the empty array if there are multiple channels
  if (mat.channels() !== 1) {
    return points;
  }

  // slightly optimizes the process by not performing a sparse check on every point
  // Mirada treats the mat like a vector instead of a matrix and so it needs to be accessed like a 1D matrix
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (mat.charAt(i * cols + j) !== 0) {
        points.push([i, j]);
        totalPoints++;
      }
    }
  }

  console.log("Points:", totalPoints);
  pointsFn(totalPoints);

  return points;
}
