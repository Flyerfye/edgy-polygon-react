import React from "react";
import DefaultFileButton from "../ui/DefaultFileButton";
import FileInputButton from "../ui/FileInputButton";
import classes from "./IntroModal.module.css";

interface IntroModalProps {
  closeAndUploadImgFn: (file: File) => void;
}

export default function IntroModal(props: IntroModalProps) {
  return (
    <div className={classes.introModal} data-testid="intro-modal">
      <h1 className={classes.h1}>Welcome!</h1>
      <h2 className={classes.h2}>Quick Start:</h2>
      <ol className={classes.ol}>
        <b>
          <li>Click one of the options below to load an image</li>
        </b>
        <b>
          <li>Fiddle with the controls to fine tune the result</li>
        </b>
        <b>
          <li>Click &apos;Save Image&apos; when you are done</li>
        </b>
      </ol>
      <p className={classes.p}>
        Feel free to send any feedback to my gmail:
        <br />
        Issa.Beekun@you-know-where
      </p>
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
