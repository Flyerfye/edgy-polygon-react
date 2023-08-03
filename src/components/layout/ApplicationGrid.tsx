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

export default function ApplicationGrid(props: any) {
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

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
          edgeMinThreshold: "0",
          edgeMaxThreshold: "50",
          pointSpacing: "0",
          sparseness: "1",
          borderPoints: "1",
          smoothColors: "0",
          showPoints: false,
        });
      };

      image.onerror = function () {
        throw new Error("Invalid image source");
      };
    };
    reader.readAsDataURL(file);
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
            <FileInputButton fileFn={updateSourceImg} />
            Source
          </ControlsPanel>
          <ControlsPanel>Edge</ControlsPanel>
          <ControlsPanel>Polygon</ControlsPanel>
        </ControlsPanelGrid>
      </main>
    </div>
  );
}
