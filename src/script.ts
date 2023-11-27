import { RenderPolygonFn } from "./RenderPolygon";
import * as cv from "mirada/dist/src/opencv";

interface ProcessImageProps {
  imgElem: HTMLImageElement | null;
  edgeResizeFactor: number;
  polygonResizeFactor: number;
  edgeMinThreshold: number;
  edgeMaxThreshold: number;
  pointSpacing: number;
  sparseness: number;
  borderPoints: number;
  colorSampRadius: number;
  showPoints: boolean;
  saveImage: boolean;
  pointsFn: (arg1: number) => void;
}

export function processImage(props: ProcessImageProps): void {
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
function processImageCallback(props: ProcessImageProps): void {
  console.log("OpenCV is now ready, processing image");
  if(!props.imgElem) {throw new Error("Image element cannot be null or undefined");}

  const cvSrc = cv.imread(props.imgElem);
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

  const cvDst_resized = new cv.Mat();
  const dsize = new cv.Size(
    props.imgElem?.width * props.edgeResizeFactor,
    props.imgElem?.height * props.edgeResizeFactor
  );
  cv.resize(cvDst, cvDst_resized, dsize, 0, 0, cv.INTER_AREA);
  // cv.imshow("edgeCanvas", cvDst);
  cv.imshow("edgeCanvas", cvDst_resized);

  const dstPts = matToPoints(cvDst, props.polygonResizeFactor, props.pointsFn);
  cvSrc?.delete();
  cvDst.delete();

  RenderPolygonFn({
    imgElem: props.imgElem,
    polygonResizeFactor: props.polygonResizeFactor,
    borderPoints: +props.borderPoints,
    colorSampRadius: +props.colorSampRadius,
    showPoints: props.showPoints,
    saveImage: props.saveImage,
    points: dstPts,
    onSuccess: function (canvas: HTMLCanvasElement) {
      if (props.saveImage) {
        const polyCanvasHiddenDiv = document.getElementById(
          "polyCanvasHiddenDiv"
        );
        
        if (!polyCanvasHiddenDiv) {
          throw new Error("Poly canvas hidden div cannot be null or undefined");
        }

        polyCanvasHiddenDiv.innerHTML = "";
        polyCanvasHiddenDiv.appendChild(canvas);
      } else {
        const polyCanvasDiv = document.getElementById("polyCanvasDiv");
        
        if (!polyCanvasDiv) {
          throw new Error("Poly canvas div cannot be null or undefined");
        }
        
        polyCanvasDiv.innerHTML = "";
        // resizeTo(canvas, props.polygonResizeFactor);
        polyCanvasDiv.appendChild(canvas);
      }
    },
  });
}

// Filters the points in the image matrix based upon a specified minimum distance between px
export function generateSpacedMat(mat, dist: number) {
  //get the dimensions of the Mat object
  const rows = mat.rows;
  const cols = mat.cols;
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const currentPixel = mat.charAt(x * cols + y);
      if (currentPixel !== 0) {
        //lazy erase a rectangle distance around the current point
        //not necessary to search up since we will always be erasing down first
        for (
          let erase_x = x;
          erase_x < (x + dist < rows ? x + dist : rows);
          erase_x++
        ) {
          for (
            let erase_y = y - dist > 0 ? y - dist : 0;
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
export function generateSparseMat(mat, sparseness: number) {
  //get the dimensions of the Mat object
  const rows = mat.rows;
  const cols = mat.cols;
  const sparseValue = +sparseness;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const currentPixel = mat.charAt(x * cols + y);
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
export function matToPoints(
  mat,
  resizeFactor: number,
  pointsFn: (arg1: number) => void
): number[][] {
  //get the dimensions of the Mat object
  const rows = mat.rows;
  const cols = mat.cols;
  let totalPoints = 0;

  const points: number[][] = [];
  //return the empty array if there are multiple channels
  if (mat.channels() !== 1) {
    return points;
  }

  // slightly optimizes the process by not performing a sparse check on every point
  // Mirada treats the mat like a vector instead of a matrix and so it needs to be accessed like a 1D matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (mat.charAt(i * cols + j) !== 0) {
        points.push([
          Math.round(i * resizeFactor),
          Math.round(j * resizeFactor),
        ]);
        totalPoints++;
      }
    }
  }

  console.log("Points:", totalPoints);
  pointsFn(totalPoints);

  return points;
}
