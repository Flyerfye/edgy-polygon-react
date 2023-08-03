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
  console.log("OpenCV is now ready");
  console.log("processImage");

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

  // cvDst = generateSpacedMat(cvDst, +props.pointSpacing);

  let dstPts = matToPoints(cvDst, +props.sparseness);
  // pointsDetectedLabel!.innerText = "" + totalPoints;
  // generateSparseMat(cvDst, +props.sparseness);
  // cv.imshow("edgeCanvas", generateSparseMat(cvDst, +props.sparseness));
  cv.imshow("edgeCanvas", cvDst);
  cvSrc?.delete();
  cvDst.delete();

  RenderPolygonFn({
    points: dstPts,
    borderPoints: +props.borderPoints,
    smoothColors: +props.smoothColors,
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
  var sparseValue = +sparseness.value;
  var sparseCount = 1;

  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols; y++) {
      var currentPixel = mat.charAt(x * cols + y);
      if (currentPixel !== 0) {
        if (sparseValue === sparseCount++) {
          //when the sparse count is reached, leave the current non-zero pixel as is
          sparseCount = 1;
        } else {
          //if the sparse count hasn't been reached 'erase' the current non-zero pixel
          mat.data[x * cols + y] = 0;
        }
      }
    }
  }

  return mat;
}

// Converts the matrix of values returned from edge detection to an array of points
export function matToPoints(mat: any, sparseness: any): number[][] {
  //get the dimensions of the Mat object
  var rows = mat.rows;
  var cols = mat.cols;
  var sparseValue = +sparseness;
  var sparseCount = 1;
  var totalPoints = 0;

  var points: number[][] = [];
  //return the empty array if there are multiple channels
  if (mat.channels() !== 1) {
    return points;
  }

  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols; y++) {
      // Mirada treats the mat like a vector instead of a matrix and so it needs to be accessed like a 1D matrix
      if (mat.charAt(x * cols + y) !== 0 && sparseValue === sparseCount++) {
        // console.log("Point (",x,",",y,")");
        points.push([x, y]);
        sparseCount = 1;
        totalPoints++;
      }
    }
  }

  console.log("Points:", totalPoints);

  return points;
}
