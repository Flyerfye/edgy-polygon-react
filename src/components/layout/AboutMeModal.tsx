import classes from "./AboutMeModal.module.css";

export default function AboutMeModal(props) {
  return (
    <div className={classes.aboutMeModal}>
      <h1>Hello!</h1>
      <p>
        I'm Issa Beekun, a software engineer based in Seattle. This app is a
        project I am using to teach myself about Typescript and React. <br />
        <br />I hand-created some{" "}
        <a href="https://twitter.com/goodflyerfye/status/991529959167483904">
          low-poly art
        </a>{" "}
        a while ago and wanted to implement a way to do it dynamically.
        <br />
        <br />I was able to draw from some existing{" "}
        <a href="https://github.com/evansque/polygonize">good examples</a> and
        built out the image processing/mathy bits in addition to the React logic
        make this app.
        <br />
        <br />
        In the past, I've spent years working at business intelligence giant
        Tableau and a startup that seeks to humanize the interaction between
        governments and the people they serve, Promise Pay.
        <br />
        <br />
        I'm now returning to the tech industry after spending time traveling
        overseas and have my sights set on making a positive impact in the
        increasingly aparent consequences of climate change.
      </p>

      <button className={classes.button} onClick={props.closeFn}>
        Nice to meet you!
      </button>
    </div>
  );
}