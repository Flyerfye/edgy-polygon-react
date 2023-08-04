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

export default function ApplicationGrid(props: any) {
  const ID_MIN_THRESHOLD = "edge-min-threshold";
  const ID_MAX_THRESHOLD = "edge-max-threshold";
  const ID_POINT_SPACING = "point-spacing";
  const ID_SPARSENESS = "sparseness";
  const ID_BORDER_POINTS = "border-points";
  const ID_COLOR_SAMP_RADIUS = "color-sample-radius";
  const ID_SHOW_TRI_POINTS = "show-triangle-points";

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

  const updateSourceImg = (file: File) => {
    //reads and process the source image
    const reader = new FileReader();
    const image = new Image();
    reader.onloadend = () => {
      image.src = reader.result as string;
      image.id = "inputImage";
      image.onload = () => {
        setSourceImg(image);

        processImage({
          imgElem: image,
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
      default: {
        throw new Error("Invalid parameter specified");
      }
    }

    processImage({
      imgElem: sourceImg,
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
          <ImagePanel panelName="sourceImage">
            <ImageCanvas imgElem={sourceImg} />
            <div>
              <b>Source Image</b>
            </div>
          </ImagePanel>
          <ImagePanel panelName="edgeImage">
            <EdgeCanvas />
            <div>
              <b>Edge Image</b>
            </div>
          </ImagePanel>
          <ImagePanel panelName="polygonImage">
            <PolyCanvas />
            <div>
              <b>Polygon Image</b>
            </div>
          </ImagePanel>
        </ImagePanelGrid>
        <ControlsPanelGrid>
          <ControlsPanel>
            Upload an image to begin:
            <FileInputButton fileFn={updateSourceImg} /><br/>
            <DefaultFileButton
              clickFn={updateSourceImg}
              buttonTxt="Show Me The Bird!"
              inputFile="media/Birb.jpg"
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
