import React from "react";

interface DefaultFileButtonProps {
  className: string;
  buttonTxt: string;
  inputFile: string;
  id:string;
  clickFn: (file: File) => void;
}

export default function DefaultFileButton(props: DefaultFileButtonProps) {
  const handleClick = () => {
    //generate blob to be parsed by reader.readAsDataURL() later
    const request = new XMLHttpRequest();
    request.open("GET", props.inputFile, true);
    request.responseType = "blob";

    request.onload = function () {
      props.clickFn(request.response);
    };
    request.send();
  };

  return (
    <button className={props.className} id={props.id} data-testid={props.id} onClick={handleClick}>
      {props.buttonTxt}
    </button>
  );
}
