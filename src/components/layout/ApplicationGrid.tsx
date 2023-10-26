import { useState } from "react";
import classes from "./ApplicationGrid.module.css";
import Backdrop from "./Backdrop";
import IntroModal from "./IntroModal";
import ImagePanelGrid from "./ImagePanelGrid";
import ImagePanel from "./ImagePanel";
import ImageCanvas from "./ImageCanvas";
import EdgeCanvas from "./EdgeCanvas";
import ControlsPanelGrid from "./ControlsPanelGrid";
import ControlsPanel from "./ControlsPanel";
import FileInputButton from "../ui/FileInputButton";
import { processImage } from "../../script";
import PolyCanvas from "./PolyCanvas";
import MultiRangeSliderBar from "../ui/MultiRangeSliderBar";
import DefaultFileButton from "../ui/DefaultFileButton";
import MainImage from "./MainImage";
import SidebarImages from "./SidebarImages";
import HeaderPanel from "./HeaderPanel";
import FileExportButton from "../ui/FileExportButton";
import ToggleButton from "../ui/ToggleButton";
import FooterPanel from "./FooterPanel";
import AboutMeModal from "./AboutMeModal";

export default function ApplicationGrid(props: any) {
  const ID_MIN_THRESHOLD = "edge-min-threshold";
  const ID_MAX_THRESHOLD = "edge-max-threshold";
  const ID_MIN_MAX_THRESHOLD = "edge-min-max-threshold";
  const ID_POINT_SPACING = "point-spacing";
  const ID_SPARSENESS = "sparseness";
  const ID_COLOR_SAMP_RADIUS = "color-sample-radius";
  const ID_SHOW_TRI_POINTS = "show-triangle-points";
  const ID_SAVE_IMAGE = "save-image";
  const ID_WINDOW_RESIZE = "window-resize";

  const [introModalOpen, setIntroModalOpen] = useState(true);
  const [aboutMeModalOpen, setAboutMeModalOpen] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // const [mainImagePanelSize, setMainImagePanelSize] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [sideImagePanelSize, setSideImagePanelSize] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [mainResizeFactor, setMainResizeFactor] = useState(0.1);
  const [sideResizeFactor, setSideResizeFactor] = useState(0.1);

  //source image params
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

  //edge image params
  const [pointsDetected, setPointsDetected] = useState<number | null>(0);
  const [minThreshold, setMinThreshold] = useState<number | null>(25);
  const [maxThreshold, setMaxThreshold] = useState<number | null>(100);
  const [pointSpacing, setPointSpacing] = useState<number | null>(10);
  const [sparseness, setSparseness] = useState<number | null>(1);

  //poly image params
  const [borderPoints, setBorderPoints] = useState<number | null>(10);
  const [colorSampRadius, setColorSampRadius] = useState<number | null>(0);
  const [showTrianglePoints, setShowTrianglePoints] = useState<boolean | null>(
    false
  );

  const pointSpacingMarks = {
    0: "0",
    30: "30",
  };

  const thresholdMarks = {
    0: "0",
    300: "100",
  };

  const sparsenessMarks = {
    1: "1",
    30: "30",
  };

  const sampleRadiusMarks = {
    0: "0",
    3: "3",
  };

  const closeIntroAndUploadSourceImg = (file: File) => {
    setIntroModalOpen(false);
    updateSourceImg(file);
  };

  const openAboutMe = () => {
    setAboutMeModalOpen(true);
  };

  const closeAboutMe = () => {
    setAboutMeModalOpen(false);
  };

  const downloadPolyImg = () => {
    const canvas = document.getElementById("hiddenPolyCanvas");
    console.log("downloadPolyImg", canvas);
    // Ensure the canvas element exists
    if (canvas instanceof HTMLCanvasElement) {
      const polyUrl = canvas.toDataURL("image/png");

      // Create an anchor element
      const a = document.createElement("a");
      a.href = polyUrl;
      a.download = "polyImage.png"; // Set the desired file name

      console.log("Download", a);
      // Trigger a click event on the anchor element
      a.click();
    }
  };

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

    // // via the golden ratio, the main image section is square
    // setMainImagePanelSize({
    //   width: imageGridHeight,
    //   height: imageGridHeight,
    // });
    // setSideImagePanelSize({
    //   width: imageGridWidth - imageGridHeight,
    //   height: imageGridHeight / 2,
    // });

    // if ratio of image width:height > that of main panel, the width is the limiting factor
    // 30 pixels adjustment accounts for the horizontal padding of the elements
    let imageRatio = imgWidth / imgHeight;
    let tempMainResizeFactor = 1;
    if (imageRatio >= 1) {
      tempMainResizeFactor = (imageGridHeight - 30) / imgWidth;
    } else {
      tempMainResizeFactor = imageGridHeight / imgHeight;
    }

    // if ratio of image width:height > that of side panel, the width is the limiting factor
    // the 5px reduction in side image height is to adjust for the 10px gap between those two images
    let sidePanelRatio =
      (imageGridWidth - imageGridHeight) / (imageGridHeight / 2 - 5);
    let tempSideResizeFactor = 1;
    if (imageRatio >= sidePanelRatio) {
      tempSideResizeFactor = (imageGridWidth - imageGridHeight - 30) / imgWidth;
    } else {
      tempSideResizeFactor = (imageGridHeight / 2 - 5) / imgHeight;
    }

    // setMainResizeFactor((prevMainResizeFactor) => tempMainResizeFactor);
    setSideResizeFactor((prevSideResizeFactor) => tempSideResizeFactor);

    return {
      mainResizeValue: tempMainResizeFactor,
      sideResizeValue: tempSideResizeFactor,
    };
  };

  const updateSourceImg = (file: File) => {
    console.log("Default File Button updateSourceImg");
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

  const reprocessImage = (
    paramName: string,
    paramValue: number | [number, number] | boolean
  ) => {
    let { mainResizeValue, sideResizeValue } = updatePanelLayout(
      sourceImg?.width,
      sourceImg?.height
    );

    // since state updates async, it is quicker to make the call to process image
    // using a prop containing the updated param value directly
    let reprocessProps = {
      imgElem: sourceImg,
      edgeResizeFactor: sideResizeValue,
      polygonResizeFactor: mainResizeValue,
      edgeMinThreshold: minThreshold,
      edgeMaxThreshold: maxThreshold,
      pointSpacing: pointSpacing,
      sparseness: sparseness,
      borderPoints: borderPoints,
      colorSampRadius: colorSampRadius,
      showPoints: showTrianglePoints,
      saveImage: false,
      pointsFn: setPointsDetected,
    };

    switch (paramName) {
      case ID_MIN_THRESHOLD: {
        reprocessProps.edgeMinThreshold = paramValue as number;
        setMinThreshold(reprocessProps.edgeMinThreshold);
        break;
      }
      case ID_MAX_THRESHOLD: {
        reprocessProps.edgeMaxThreshold = paramValue as number;
        setMaxThreshold(reprocessProps.edgeMaxThreshold);
        break;
      }
      case ID_POINT_SPACING: {
        reprocessProps.pointSpacing = paramValue[0] as number;
        setPointSpacing(reprocessProps.pointSpacing);
        break;
      }
      case ID_SPARSENESS: {
        reprocessProps.sparseness = paramValue as number;
        setSparseness(reprocessProps.sparseness);
        break;
      }
      case ID_COLOR_SAMP_RADIUS: {
        reprocessProps.colorSampRadius = paramValue as number;
        setColorSampRadius(reprocessProps.colorSampRadius);
        break;
      }
      case ID_SHOW_TRI_POINTS: {
        reprocessProps.showPoints = paramValue as boolean;
        setShowTrianglePoints(reprocessProps.showPoints);
        break;
      }
      case ID_MIN_MAX_THRESHOLD: {
        reprocessProps.edgeMinThreshold = Math.min(...(paramValue as number[]));
        setMinThreshold(reprocessProps.edgeMinThreshold);
        reprocessProps.edgeMaxThreshold = Math.max(...(paramValue as number[]));
        setMaxThreshold(reprocessProps.edgeMaxThreshold);
        break;
      }
      case ID_SAVE_IMAGE: {
        //when generating the polygon image for saving, we don't want any resizing based on viewport size
        reprocessProps.saveImage = true;
        reprocessProps.polygonResizeFactor = 1;
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

    processImage(reprocessProps);
  };

  return (
    <div>
      {/* display the IntroModal when the app is first loaded */}
      {introModalOpen && (
        <IntroModal closeAndUploadImg={closeIntroAndUploadSourceImg} />
      )}
      {aboutMeModalOpen && <AboutMeModal closeFn={closeAboutMe} />}
      {(introModalOpen || aboutMeModalOpen) && <Backdrop />}
      <main className={classes.main}>
        <HeaderPanel>
          <FileInputButton
            className={classes.button}
            fileFn={updateSourceImg}
          />
          <DefaultFileButton
            className={classes.button}
            clickFn={updateSourceImg}
            buttonTxt="Show Me The Bird!"
            inputFile="media/Birb.jpg"
          />
          <FileExportButton
            className={classes.button}
            rerenderId={ID_SAVE_IMAGE}
            rerenderFn={reprocessImage}
            clickFn={downloadPolyImg}
          />
        </HeaderPanel>
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

        <div className={classes.pointsInfoContainer}>
          <table>
            <tr>
              <th>
                <b># Polygon Points:</b> {pointsDetected}
              </th>
              <th>
                <b>
                  {/* Renders the points returned from the edge algorithm on top of the polygon image */}
                  {/* <Checkbox
                      id={ID_SHOW_TRI_POINTS}
                      name="Show Points"
                      defaultValue={showTrianglePoints}
                      rerenderFn={reprocessImage}
                    /> */}
                  <ToggleButton
                    className={classes.button}
                    rerenderId={ID_SHOW_TRI_POINTS}
                    rerenderFn={reprocessImage}
                    textA="Show Points"
                    textB="Hide Points"
                  />
                </b>
              </th>
            </tr>
          </table>
        </div>

        <ControlsPanelGrid>
          <ControlsPanel>
            {/* OpenCV min/max threshold level for Canny edge detection alg */}
            <MultiRangeSliderBar
              id={ID_MIN_MAX_THRESHOLD}
              name="Detection Threshold"
              tooltip="The upper and lower thresholds for edge detection in source image.
              Lower values for either will produce a more detailed main image."
              min={0}
              max={300}
              step="1"
              values={[minThreshold, maxThreshold]}
              customMarks={thresholdMarks}
              rerenderFn={reprocessImage}
            />
            {/* OpenCV minimum threshold level for Canny edge detection alg */}
            {/* <RangeSliderBar
              id={ID_MIN_THRESHOLD}
              name="Min Level"
              min="0"
              max="150"
              step="1"
              defaultValue={minThreshold}
              rerenderFn={reprocessImage}
            /> */}
            {/* OpenCV maximum threshold level for Canny edge detection alg */}
            {/* <RangeSliderBar
              id={ID_MAX_THRESHOLD}
              name="Max Level"
              min="50"
              max="300"
              step="1"
              defaultValue={maxThreshold}
              rerenderFn={reprocessImage}
            /> */}
            {/* The rectangular 'radius' from the center of a given polygon in which all pixel colors will be averaged */}
            {/* Not guaranteed that the pixels average will actually exist within the given polygon */}
            {/* <RangeSliderBar
              id={ID_COLOR_SAMP_RADIUS}
              name="Color Sample Radius"
              min="0"
              max="3"
              step="1"
              defaultValue={colorSampRadius}
              rerenderFn={reprocessImage}
            /> */}
            <MultiRangeSliderBar
              id={ID_COLOR_SAMP_RADIUS}
              name="Color Sample Radius"
              tooltip="Defines how accurately each polygon reflects the colors in the same part of the original image.
              Increasing this value will make the main image look more realistic."
              min={0}
              max={3}
              step="1"
              values={[colorSampRadius]}
              customMarks={sampleRadiusMarks}
              rerenderFn={reprocessImage}
            />
          </ControlsPanel>
          <ControlsPanel>
            {/* Minimum space allowed between points returned from edge detection */}
            {/* <RangeSliderBar
              id={ID_POINT_SPACING}
              name="Min Spacing"
              min="0"
              max="30"
              step="1"
              defaultValue={pointSpacing}
              rerenderFn={reprocessImage}
            /> */}
            <MultiRangeSliderBar
              id={ID_POINT_SPACING}
              name="Min Point Spacing"
              tooltip="Minimum distance between any two points used for polygon vertices.
              Increasing this value will result in larger polygons in the main image."
              min={0}
              max={30}
              step="1"
              values={[pointSpacing]}
              customMarks={pointSpacingMarks}
              rerenderFn={reprocessImage}
            />
            {/* Reduces the number of edge detected points by this factor without considering relative positioning */}
            {/* <RangeSliderBar
              id={ID_SPARSENESS}
              name="Sparseness"
              min="1"
              max="30"
              step="1"
              defaultValue={sparseness}
              rerenderFn={reprocessImage}
            /> */}
            <MultiRangeSliderBar
              id={ID_SPARSENESS}
              name="Random Spacing"
              tooltip="Randomizes the spacing between two points by the specified factor.
              Increasing this will reduce how much the detected edges form the main image."
              min={1}
              max={30}
              step="1"
              values={[sparseness]}
              customMarks={sparsenessMarks}
              rerenderFn={reprocessImage}
            />
            {/* Number of border points along each image edge, spread out equally */}
            {/* Not guaranteed to result in equal polygon spacing in relation to the edges of the image */}
            {/* <RangeSliderBar
              id={ID_BORDER_POINTS}
              name="# Border Points"
              min="0"
              max="10"
              step="1"
              defaultValue={borderPoints}
              rerenderFn={reprocessImage}
            /> */}
          </ControlsPanel>
        </ControlsPanelGrid>
        <FooterPanel>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tr>
              <td className="link">
                {/* It is convention not to use a href tags when there is no navigation to another page
                Using a disguised button here instead */}
                <button className={classes.buttonLink} onClick={openAboutMe}>
                  About Me
                </button>
                {/* <a href="#" onClick={openAboutMe}>
                  About Me
                </a> */}
              </td>
              <td className="link">
                <a href="https://www.linkedin.com/in/issabeekun/">LinkedIn</a>
              </td>
              <td className="link">
                <a href="https://github.com/Flyerfye/edgy-polygon-react">
                  GitHub
                </a>
              </td>
            </tr>
          </table>
        </FooterPanel>
      </main>
    </div>
  );
}
