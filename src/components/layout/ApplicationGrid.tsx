import { useState } from "react";
import ImagePanelGrid from "./ImagePanelGrid";
import ImagePanel from "./ImagePanel";
import ImageCanvas from "./ImageCanvas";
import EdgeCanvas from "./EdgeCanvas";
import ControlsPanelGrid from "./ControlsPanelGrid";
import ControlsPanel from "./ControlsPanel";
import FileInputButton from "../ui/FileInputButton";
import { processImage } from "../../script";
import PolyCanvas from "./PolyCanvas";
import RangeSliderBar from "../ui/RangeSliderBar";
import Checkbox from "../ui/Checkbox";
import DefaultFileButton from "../ui/DefaultFileButton";
import MainImage from "./MainImage";
import SidebarImages from "./SidebarImages";

export default function ApplicationGrid(props: any) {
  const ID_MIN_THRESHOLD = "edge-min-threshold";
  const ID_MAX_THRESHOLD = "edge-max-threshold";
  const ID_POINT_SPACING = "point-spacing";
  const ID_SPARSENESS = "sparseness";
  const ID_BORDER_POINTS = "border-points";
  const ID_COLOR_SAMP_RADIUS = "color-sample-radius";
  const ID_SHOW_TRI_POINTS = "show-triangle-points";
  const ID_WINDOW_RESIZE = "window-resize";

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mainImagePanelSize, setMainImagePanelSize] = useState({
    width: 0,
    height: 0,
  });
  const [sideImagePanelSize, setSideImagePanelSize] = useState({
    width: 0,
    height: 0,
  });
  const [mainResizeFactor, setMainResizeFactor] = useState(0.1);
  const [sideResizeFactor, setSideResizeFactor] = useState(0.1);

  //source image params
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

  //edge image params
  const [pointsDetected, setPointsDetected] = useState<number | null>(0);
  const [minThreshold, setMinThreshold] = useState<number | null>(80);
  const [maxThreshold, setMaxThreshold] = useState<number | null>(120);
  const [pointSpacing, setPointSpacing] = useState<number | null>(0);
  const [sparseness, setSparseness] = useState<number | null>(1);

  //poly image params
  const [borderPoints, setBorderPoints] = useState<number | null>(0);
  const [colorSampRadius, setColorSampRadius] = useState<number | null>(0);
  const [showTrianglePoints, setShowTrianglePoints] = useState<boolean | null>(
    false
  );

  const updatePanelLayout = (imgWidth, imgHeight) => {
    const goldenRatio = 1.618;
    var imageGridWidth = windowSize.width;
    var imageGridHeight = windowSize.height;

    if (imageGridWidth < 300) {
      imageGridWidth = 300;
      imageGridHeight = 185;
    }
    // if the window is too wide, use the height as the constraint
    else if (imageGridWidth / imageGridHeight > goldenRatio) {
      imageGridWidth = Math.floor(imageGridHeight * goldenRatio);
    }
    // if the window is too tall, use the width as the constraint
    else {
      imageGridHeight = Math.floor(imageGridWidth / goldenRatio);
    }

    // via the golden ratio, the main image section is square
    setMainImagePanelSize({
      width: imageGridHeight,
      height: imageGridHeight,
    });
    setSideImagePanelSize({
      width: imageGridWidth - imageGridHeight,
      height: imageGridHeight / 2,
    });

    // if ratio of image width:height > that of main panel, the width is the limiting factor
    // 30 pixels adjustment accounts for the horizontal padding of the elements
    let imageRatio = imgWidth / imgHeight;
    let tempMainResizeFactor = 1;
    if (imageRatio >= 1) {
      tempMainResizeFactor = (imageGridHeight - 30) / imgWidth;
    } else {
      tempMainResizeFactor = (imageGridHeight) / imgHeight;
    }

    // if ratio of image width:height > that of side panel, the width is the limiting factor
    let sidePanelRatio =
      (imageGridWidth - imageGridHeight) / (imageGridHeight / 2);
    let tempSideResizeFactor = 1;
    if (imageRatio >= sidePanelRatio) {
      tempSideResizeFactor = (imageGridWidth - imageGridHeight - 30) / imgWidth;
    } else {
      tempSideResizeFactor = imageGridHeight / 2 / imgHeight;
    }

    console.log("Window size", windowSize.width, ",", windowSize.height);
    console.log("Image Grid size", imageGridWidth, ",", imageGridHeight);
    console.log("Main Panel size", imageGridHeight, ",", imageGridHeight);
    console.log(
      "Side Panel size",
      imageGridWidth - imageGridHeight,
      ",",
      imageGridHeight / 2
    );
    setMainResizeFactor((prevMainResizeFactor) => tempMainResizeFactor);
    setSideResizeFactor((prevSideResizeFactor) => tempSideResizeFactor);

    return {
      mainResizeValue: tempMainResizeFactor,
      sideResizeValue: tempSideResizeFactor,
    };
  };

  const updateSourceImg = (file: File) => {
    //reads and process the source image
    const reader = new FileReader();
    const image = new Image();
    reader.onloadend = () => {
      image.src = reader.result as string;
      image.id = "inputImage";
      image.onload = () => {
        setSourceImg(image);
        let { mainResizeValue, sideResizeValue } = updatePanelLayout(
          image.width,
          image.height
        );

        processImage({
          imgElem: image,
          edgeResizeFactor: sideResizeValue,
          polygonResizeFactor: mainResizeValue,
          edgeMinThreshold: minThreshold,
          edgeMaxThreshold: maxThreshold,
          pointSpacing: pointSpacing,
          sparseness: sparseness,
          borderPoints: borderPoints,
          smoothColors: colorSampRadius,
          showPoints: showTrianglePoints,
          pointsFn: setPointsDetected,
        });
      };

      image.onerror = function () {
        throw new Error("Invalid image source");
      };
    };
    reader.readAsDataURL(file);
  };

  const reprocessImage = (paramName: string, paramValue: number | boolean) => {
    // since state updates async, it is quicker to make the call to process image
    // using the updated param value directly
    let tempMinThreshold = minThreshold;
    let tempMaxThreshold = maxThreshold;
    let tempPointSpacing = pointSpacing;
    let tempSparseness = sparseness;
    let tempBorderPoints = borderPoints;
    let tempColorSampRadius = colorSampRadius;
    let tempShowTrianglePoints = showTrianglePoints;
    switch (paramName) {
      case ID_MIN_THRESHOLD: {
        tempMinThreshold = paramValue as number;
        setMinThreshold(tempMinThreshold);
        break;
      }
      case ID_MAX_THRESHOLD: {
        tempMaxThreshold = paramValue as number;
        setMaxThreshold(tempMaxThreshold);
        break;
      }
      case ID_POINT_SPACING: {
        tempPointSpacing = paramValue as number;
        setPointSpacing(tempPointSpacing);
        break;
      }
      case ID_SPARSENESS: {
        tempSparseness = paramValue as number;
        setSparseness(tempSparseness);
        break;
      }
      case ID_BORDER_POINTS: {
        tempBorderPoints = paramValue as number;
        setBorderPoints(tempBorderPoints);
        break;
      }
      case ID_COLOR_SAMP_RADIUS: {
        tempColorSampRadius = paramValue as number;
        setColorSampRadius(tempColorSampRadius);
        break;
      }
      case ID_SHOW_TRI_POINTS: {
        tempShowTrianglePoints = paramValue as boolean;
        setShowTrianglePoints(tempShowTrianglePoints);
        break;
      }
      case ID_WINDOW_RESIZE: {
        // TODO: handle resize case 
        break;
      }
      default: {
        throw new Error("Invalid parameter specified");
      }
    }

    let { mainResizeValue, sideResizeValue } = updatePanelLayout(
      sourceImg?.width,
      sourceImg?.height
    );
    processImage({
      imgElem: sourceImg,
      edgeResizeFactor: sideResizeValue,
      polygonResizeFactor: mainResizeValue,
      edgeMinThreshold: tempMinThreshold,
      edgeMaxThreshold: tempMaxThreshold,
      pointSpacing: tempPointSpacing,
      sparseness: tempSparseness,
      borderPoints: tempBorderPoints,
      colorSampRadius: tempColorSampRadius,
      showPoints: tempShowTrianglePoints,
      pointsFn: setPointsDetected,
    });
  };

  return (
    <div>
      <main>
        <ImagePanelGrid>
          <MainImage>
            <ImagePanel panelName="polygonImage">
              <PolyCanvas />
            </ImagePanel>
          </MainImage>
          <SidebarImages>
            <ImagePanel panelName="sourceImage">
              <ImageCanvas
                imgElem={sourceImg}
                resizeFactor={sideResizeFactor}
              />
            </ImagePanel>
            <ImagePanel panelName="edgeImage">
              <EdgeCanvas />
            </ImagePanel>
          </SidebarImages>
        </ImagePanelGrid>
        <ControlsPanelGrid>
          <ControlsPanel>
            Upload an image to begin:
            <FileInputButton fileFn={updateSourceImg} />
            <br />
            <DefaultFileButton
              clickFn={updateSourceImg}
              buttonTxt="Show Me The Bird!"
              inputFile="media/Birb.jpg"
            />
            <br />
            <DefaultFileButton
              clickFn={updateSourceImg}
              buttonTxt="Rectangle"
              inputFile="media/Checker_horiz.png"
            />
          </ControlsPanel>
          <ControlsPanel>
            <b># Points: </b>
            {pointsDetected}
            {/* OpenCV minimum threshold level for Canny edge detection alg */}
            <RangeSliderBar
              id={ID_MIN_THRESHOLD}
              name="Min Level"
              min="0"
              max="150"
              step="1"
              defaultValue={minThreshold}
              rerenderFn={reprocessImage}
            />
            {/* OpenCV maximum threshold level for Canny edge detection alg */}
            <RangeSliderBar
              id={ID_MAX_THRESHOLD}
              name="Max Level"
              min="50"
              max="300"
              step="1"
              defaultValue={maxThreshold}
              rerenderFn={reprocessImage}
            />
            {/* Minimum space allowed between points returned from edge detection */}
            <RangeSliderBar
              id={ID_POINT_SPACING}
              name="Min Spacing"
              min="0"
              max="30"
              step="1"
              defaultValue={pointSpacing}
              rerenderFn={reprocessImage}
            />
            {/* Reduces the number of edge detected points by this factor without considering relative positioning */}
            <RangeSliderBar
              id={ID_SPARSENESS}
              name="Sparseness"
              min="1"
              max="30"
              step="1"
              defaultValue={sparseness}
              rerenderFn={reprocessImage}
            />
          </ControlsPanel>
          <ControlsPanel>
            {/* Number of border points along each image edge, spread out equally */}
            {/* Not guaranteed to result in equal polygon spacing in relation to the edges of the image */}
            <RangeSliderBar
              id={ID_BORDER_POINTS}
              name="# Border Points"
              min="0"
              max="10"
              step="1"
              defaultValue={borderPoints}
              rerenderFn={reprocessImage}
            />
            {/* The rectangular 'radius' from the center of a given polygon in which all pixel colors will be averaged */}
            {/* Not guaranteed that the pixels average will actually exist within the given polygon */}
            <RangeSliderBar
              id={ID_COLOR_SAMP_RADIUS}
              name="Color Sample Radius"
              min="0"
              max="3"
              step="1"
              defaultValue={colorSampRadius}
              rerenderFn={reprocessImage}
            />
            {/* Renders the points returned from the edge algorithm on top of the polygon image */}
            <Checkbox
              id={ID_SHOW_TRI_POINTS}
              name="Show Triangle Points"
              defaultValue={showTrianglePoints}
              rerenderFn={reprocessImage}
            />
          </ControlsPanel>
        </ControlsPanelGrid>
      </main>
    </div>
  );
}
