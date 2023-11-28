import React, { useState } from "react";
import classes from "./SaveImageModal.module.css";
import InputTextBox from "../ui/InputTextBox";

interface SaveImageModalProps {
  defaultFilename: string;
  imageDimFn: () => (number)[];
  closeFn: (resizeFactor: number, fileName: string) => void;
}

export default function SaveImageModal(props: SaveImageModalProps) {
  const [fileName, setFileName] = useState<string>(props.defaultFilename);
  const [resizeFactor, setResizeFactor] = useState<number>(100);
  const imageDim = props.imageDimFn();

  const handleResizeFactorChange = (event) => {
    setResizeFactor(event.target.value);
  };

  const handleFilenameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleSaveButton = () => {
    props.closeFn(resizeFactor / 100, fileName);
  };

  return (
    <div className={classes.saveImageModal} data-testid='save-modal'>
      <h1 className={classes.h1}>Save Image</h1>
      {/* specify the % increase or the final resolution */}
      {/* specify the output file name */}
      <p className={classes.p}>
        Set the name and dimensions of the output image before saving: <br />
      </p>
      
      <p className={classes.p}>
        <InputTextBox
          placeholderText="Enter output file name"
          value={fileName}
          onChangeFn={handleFilenameChange}
        />
        .png
      </p>

      <p className={classes.p}>
        <input
          type="number"
          value={resizeFactor}
          onChange={handleResizeFactorChange}
          min={0} // Optional: Minimum value
          max={500} // Optional: Maximum value
        />
        % &#91;{(imageDim[0] * resizeFactor) / 100} x{" "}
        {(imageDim[1] * resizeFactor) / 100} pixels&#93;
        <br />
      </p>

      <button className={classes.button} data-testid="save-image-modal-save-button" onClick={handleSaveButton}>
        Save
      </button>
    </div>
  );
}
