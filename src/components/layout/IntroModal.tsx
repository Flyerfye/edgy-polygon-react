import DefaultFileButton from "../ui/DefaultFileButton";
import FileInputButton from "../ui/FileInputButton";
import classes from "./IntroModal.module.css";

export default function IntroModal(props) {
  return (
    <div className={classes.introModal}>
      <h1>Welcome!</h1>
      <p>
        This app is a project I am using to teach myself about Typescript and
        React. <br />
        <br />I hand-created some{" "}
        <a href="https://twitter.com/goodflyerfye/status/991529959167483904">
          low-poly art
        </a>{" "}
        a while ago and wanted to make a way to do it dynamically.
        <br />
        <br />
        With the help of some existing{" "}
        <a href="https://github.com/evansque/polygonize">good examples</a>, I
        was able to build out the image processing/mathy bits and make this app.
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
        fileFn={props.closeAndUploadImg}
      />
      <DefaultFileButton
        className={classes.button}
        clickFn={props.closeAndUploadImg}
        buttonTxt="Show Me The Bird!"
        inputFile="media/Birb.jpg"
      />
    </div>
  );
}
