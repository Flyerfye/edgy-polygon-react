import React, { useState } from "react";
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
import classes from "./ApplicationGrid.module.css";
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
import SaveImageModal from "./SaveImageModal";

export default function ApplicationGrid() {
  const ID_MIN_THRESHOLD = "edge-min-threshold";
  const ID_MAX_THRESHOLD = "edge-max-threshold";
  const ID_MIN_MAX_THRESHOLD = "edge-min-max-threshold";
  const ID_POINT_SPACING = "point-spacing";
  const ID_SPARSENESS = "sparseness";
  const ID_COLOR_SAMP_RADIUS = "color-sample-radius";
  const ID_SHOW_TRI_POINTS = "show-triangle-points";
  const ID_SAVE_IMAGE = "save-image";
  const ID_WINDOW_RESIZE = "window-resize";
  const NUM_BORDER_POINTS = 10;
  const WINDOW_SIZE = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const [introModalOpen, setIntroModalOpen] = useState(true);
  const [aboutMeModalOpen, setAboutMeModalOpen] = useState(true);
  const [saveImageModalOpen, setSaveImageModalOpen] = useState(false);

  const [sideResizeFactor, setSideResizeFactor] = useState(0.1);

  //source image params
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

  //edge image params
  const [pointsDetected, setPointsDetected] = useState<number>(0);
  const [minThreshold, setMinThreshold] = useState<number>(25);
  const [maxThreshold, setMaxThreshold] = useState<number>(100);
  const [pointSpacing, setPointSpacing] = useState<number>(10);
  const [sparseness, setSparseness] = useState<number>(1);

  //poly image params
  const [colorSampRadius, setColorSampRadius] = useState<number>(0);
  const [showTrianglePoints, setShowTrianglePoints] = useState<boolean>(false);

  //save image params
  const [saveFileName, setSaveFileName] = useState<string>("polyImage");

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

  // Used when component requires a function as part of the defined interface for input arguments
  const emptyFunction = () => {
    //
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

  const openSaveImageModal = () => {
    setSaveImageModalOpen(true);
  };

  const closeSaveImageModal = (resizeFactor: number, fileName: string) => {
    setSaveImageModalOpen(false);

    if (!fileName.toLowerCase().endsWith(".png")) {
      fileName = fileName + ".png";
    }

    setSaveFileName(fileName);

    reprocessImage(ID_SAVE_IMAGE, resizeFactor);
    downloadPolyImg(fileName);
  };

  const getCurrentImageDim = () => {
    if(!sourceImg) {
      return [0, 0];
    } else {
      return [sourceImg.width, sourceImg.height];
    }
  };

  const downloadPolyImg = (fileName: string) => {
    const canvas = document.getElementById("hiddenPolyCanvas");
    // Ensure the canvas element exists
    if (canvas instanceof HTMLCanvasElement) {
      const polyUrl = canvas.toDataURL("image/png");

      // Create an anchor element
      const a = document.createElement("a");
      a.href = polyUrl;
      a.download = fileName; // Set the desired file name

      // Trigger a click event on the anchor element
      a.click();
    }
  };

  const updatePanelLayout = (imgWidth, imgHeight) => {
    const goldenRatio = 1.618;
    let imageGridWidth = WINDOW_SIZE.width;
    let imageGridHeight = WINDOW_SIZE.height;

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

    // if ratio of image width:height > that of main panel, the width is the limiting factor
    // 30 pixels adjustment accounts for the horizontal padding of the elements
    const imageRatio = imgWidth / imgHeight;
    let tempMainResizeFactor = 1;
    if (imageRatio >= 1) {
      tempMainResizeFactor = (imageGridHeight - 30) / imgWidth;
    } else {
      tempMainResizeFactor = imageGridHeight / imgHeight;
    }

    // if ratio of image width:height > that of side panel, the width is the limiting factor
    // the 5px reduction in side image height is to adjust for the 10px gap between those two images
    const sidePanelRatio =
      (imageGridWidth - imageGridHeight) / (imageGridHeight / 2 - 5);
    let tempSideResizeFactor = 1;
    if (imageRatio >= sidePanelRatio) {
      tempSideResizeFactor = (imageGridWidth - imageGridHeight - 30) / imgWidth;
    } else {
      tempSideResizeFactor = (imageGridHeight / 2 - 5) / imgHeight;
    }

    // setMainResizeFactor((prevMainResizeFactor) => tempMainResizeFactor);
    setSideResizeFactor(() => tempSideResizeFactor);

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
        const { mainResizeValue, sideResizeValue } = updatePanelLayout(
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
          borderPoints: NUM_BORDER_POINTS,
          colorSampRadius: colorSampRadius,
          showPoints: showTrianglePoints,
          saveImage: false,
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
    paramValue: number | number[] | boolean
  ) => {
    const { mainResizeValue, sideResizeValue } = updatePanelLayout(
      sourceImg?.width,
      sourceImg?.height
    );

    // since state updates async, it is quicker to make the call to process image
    // using a prop containing the updated param value directly
    const reprocessProps = {
      imgElem: sourceImg,
      edgeResizeFactor: sideResizeValue,
      polygonResizeFactor: mainResizeValue,
      edgeMinThreshold: minThreshold,
      edgeMaxThreshold: maxThreshold,
      pointSpacing: pointSpacing,
      sparseness: sparseness,
      borderPoints: NUM_BORDER_POINTS,
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
        reprocessProps.polygonResizeFactor = paramValue as number;
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
        <IntroModal closeAndUploadImgFn={closeIntroAndUploadSourceImg} />
      )}
      {aboutMeModalOpen && <AboutMeModal closeFn={closeAboutMe} />}
      {saveImageModalOpen && 
        <SaveImageModal
          defaultFilename={saveFileName}
          imageDimFn={getCurrentImageDim}
          closeFn={closeSaveImageModal}
        />
      }
      {(introModalOpen || aboutMeModalOpen) && (
        <Backdrop onClick={emptyFunction} />
      )}
      <main className={classes.main}>
        <HeaderPanel>
          <FileInputButton
            className={classes.button}
            fileInputFn={updateSourceImg}
          />
          <DefaultFileButton
            className={classes.button}
            clickFn={updateSourceImg}
            buttonTxt="Show Me The Bird!"
            id ="application-grid-default-file-button"
          />
          <FileExportButton
            className={classes.button}
            id="application-grid-save-button"
            clickFn={openSaveImageModal}
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
            <tbody>
              <tr>
                <th>
                  <b># Polygon Points:</b> {pointsDetected}
                </th>
                <th>
                  <b>
                    {/* Renders the points returned from the edge algorithm on top of the polygon image */}
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
            </tbody>
          </table>
        </div>

        <ControlsPanelGrid>
          <ControlsPanel>
            {/* OpenCV min/max threshold level for Canny edge detection alg */}
            <MultiRangeSliderBar
              rerenderId={ID_MIN_MAX_THRESHOLD}
              name="Detection Threshold"
              tooltip="The upper and lower thresholds for edge detection in source image.
              Lower values for either will produce a more detailed main image."
              min={0}
              max={300}
              initialValues={[minThreshold, maxThreshold]}
              customMarks={thresholdMarks}
              rerenderFn={reprocessImage}
            />
            {/* The rectangular 'radius' from the center of a given polygon in which all pixel colors will be averaged */}
            {/* Not guaranteed that the pixels average will actually exist within the given polygon */}
            <MultiRangeSliderBar
              rerenderId={ID_COLOR_SAMP_RADIUS}
              name="Color Sample Radius"
              tooltip="Defines how accurately each polygon reflects the colors in the same part of the original image.
              Increasing this value will make the main image look more realistic."
              min={0}
              max={3}
              initialValues={[colorSampRadius]}
              customMarks={sampleRadiusMarks}
              rerenderFn={reprocessImage}
            />
          </ControlsPanel>
          <ControlsPanel>
            {/* Minimum space allowed between points returned from edge detection */}
            <MultiRangeSliderBar
              rerenderId={ID_POINT_SPACING}
              name="Min Point Spacing"
              tooltip="Minimum distance between any two points used for polygon vertices.
              Increasing this value will result in larger polygons in the main image."
              min={0}
              max={30}
              initialValues={[pointSpacing]}
              customMarks={pointSpacingMarks}
              rerenderFn={reprocessImage}
            />
            {/* Reduces the number of edge detected points by this factor without considering relative positioning */}
            <MultiRangeSliderBar
              rerenderId={ID_SPARSENESS}
              name="Random Spacing"
              tooltip="Randomizes the spacing between two points by the specified factor.
              Increasing this will reduce how much the detected edges form the main image."
              min={1}
              max={30}
              initialValues={[sparseness]}
              customMarks={sparsenessMarks}
              rerenderFn={reprocessImage}
            />
          </ControlsPanel>
        </ControlsPanelGrid>
        <FooterPanel>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td className="link">
                  {/* It is convention not to use a href tags when there is no navigation to another page
                Using a disguised button here instead */}
                  <button className={classes.buttonLink} data-testid="application-grid-about-me-button" onClick={openAboutMe}>
                    About Me
                  </button>
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
            </tbody>
          </table>
        </FooterPanel>
      </main>
    </div>
  );
}
