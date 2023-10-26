export default function DefaultFileButton(props: any) {
  const handleClick = () => {
    //generate blob to be parsed by reader.readAsDataURL() later
    var request = new XMLHttpRequest();
    request.open("GET", props.inputFile, true);
    request.responseType = "blob";

    request.onload = function () {
      console.log("Default File Button Request Loaded");
      props.clickFn(request.response);
    };
    request.send();
  };

  return (
    <button className={props.className} onClick={handleClick}>
      {props.buttonTxt}
    </button>
  );
}
