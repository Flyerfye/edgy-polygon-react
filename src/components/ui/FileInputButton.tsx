import React, { useRef } from "react";
import classes from "./FileInputButton.module.css";

export default function FileInputButton(props: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const inputFile = event.target.files[0];
      props.fileFn(inputFile);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={classes.main}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <button className={props.className} onClick={handleClick}>
        Choose File
      </button>
    </div>
  );
}
