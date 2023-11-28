import React from "react";
import DefaultFileButton from "../ui/DefaultFileButton";
import FileInputButton from "../ui/FileInputButton";
import classes from "./IntroModal.module.css";

interface IntroModalProps {
  closeAndUploadImgFn: (file: File) => void;
}

export default function IntroModal(props: IntroModalProps) {
  return (
    <div className={classes.introModal} data-testid='intro-modal'>
      <h1>Welcome!</h1>
      <p>
        This app is a project I used to learn about Typescript and
        React while also having fun pursuing my artistic interests.
      </p>

      <h2>Quick Start:</h2>
      <ol>
        <b>
          <li>Click one of the options below to load an image</li>
        </b>
        <b>
          <li>Fiddle with the controls to make it look pretty</li>
        </b>
        <b>
          <li>
            Feel free to send any feedback to my gmail:
            Issa.Beekun@you-know-where
          </li>
        </b>
      </ol>
      <FileInputButton
        className={classes.button}
        fileInputFn={props.closeAndUploadImgFn}
      />
      <DefaultFileButton
        className={classes.button}
        clickFn={props.closeAndUploadImgFn}
        buttonTxt="Show Me The Bird!"
        id="intro-modal-default-file-button"
      />
    </div>
  );
}
