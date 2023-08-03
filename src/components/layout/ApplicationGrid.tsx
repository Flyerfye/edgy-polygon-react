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

export default function ApplicationGrid(props: any) {
  const ID_MIN_THRESHOLD = "edge-min-threshold";
  const ID_MAX_THRESHOLD = "edge-max-threshold";
  const ID_POINT_SPACING = "point-spacing";
  const ID_SPARSENESS = "sparseness";

  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

  const [pointsDetected, setPointsDetected] = useState<number | null>(0);
  const [minThreshold, setMinThreshold] = useState<number | null>(80);
  const [maxThreshold, setMaxThreshold] = useState<number | null>(120);
  const [pointSpacing, setPointSpacing] = useState<number | null>(0);
  const [sparseness, setSparseness] = useState<number | null>(1);

  const updateSourceImg = (file: File, imageResult: string) => {
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
          borderPoints: "1",
          smoothColors: "0",
          showPoints: false,
          pointsFn: setPointsDetected,
        });
      };

      image.onerror = function () {
        throw new Error("Invalid image source");
      };
    };
    reader.readAsDataURL(file);
  };

  const reprocessImage = (paramName:string, paramValue:number
  ) => {
    let tempMinThreshold = minThreshold;
    let tempMaxThreshold = maxThreshold;
    let tempPointSpacing = pointSpacing;
    let tempSparseness = sparseness;
    switch(paramName) {
      case ID_MIN_THRESHOLD: {
        tempMinThreshold = paramValue;
        setMinThreshold(paramValue);
        break;
      }
      case ID_MAX_THRESHOLD: {
        tempMaxThreshold = paramValue;
        setMaxThreshold(paramValue);
        break;
      }
      case ID_POINT_SPACING: {
        tempPointSpacing = paramValue;
        setPointSpacing(paramValue);
        break;
      }

      case ID_SPARSENESS: {
        tempSparseness = paramValue;
        setSparseness(paramValue);
        break;
      }
      default: {
        throw new Error("Invalid parameter specified");
      }
    }

    console.log(
      "edgeMinThreshold:",
      tempMinThreshold,
      "\nedgeMaxThreshold:",
      tempMaxThreshold,
      "\npointSpacing:",
      tempPointSpacing,
      "\nsparseness:",
      tempSparseness
    );

    processImage({
      imgElem: sourceImg,
      edgeMinThreshold: tempMinThreshold,
      edgeMaxThreshold: tempMaxThreshold,
      pointSpacing: tempPointSpacing,
      sparseness: tempSparseness,
      borderPoints: "1",
      smoothColors: "0",
      showPoints: false,
      pointsFn: setPointsDetected,
    });
  };

  return (
    <div>
      <main>
        <ImagePanelGrid>
          <ImagePanel panelName="sourceImage">
            <ImageCanvas imgElem={sourceImg} />
            <div>Source Image</div>
          </ImagePanel>
          <ImagePanel panelName="edgeImage">
            <EdgeCanvas />
            <div>Edge Image</div>
          </ImagePanel>
          <ImagePanel panelName="polygonImage">
            <PolyCanvas />
            <div>Polygon Image</div>
          </ImagePanel>
        </ImagePanelGrid>
        <ControlsPanelGrid>
          <ControlsPanel>
            Source
            <FileInputButton fileFn={updateSourceImg} />
          </ControlsPanel>
          <ControlsPanel>
            # Points: {pointsDetected}
            {/* OpenCV minimum threshold level for Canny edge detection alg */}
            <RangeSliderBar
              id={ID_MIN_THRESHOLD}
              name="Min Level"
              min="0"
              max="150"
              step="1"
              defaultValue={minThreshold}
              callbackFn={setMinThreshold}
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
              callbackFn={setMaxThreshold}
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
              callbackFn={setPointSpacing}
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
              callbackFn={setSparseness}
              rerenderFn={reprocessImage}
            />
          </ControlsPanel>

          <ControlsPanel>Polygon</ControlsPanel>
        </ControlsPanelGrid>
      </main>
    </div>
  );
}
