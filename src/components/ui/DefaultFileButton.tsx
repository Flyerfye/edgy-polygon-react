import React, { useRef } from "react";

export default function DefaultFileButton(props: any) {
  const clickRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (clickRef.current) {
      clickRef.current.click();

      //generate blob to be parsed by reader.readAsDataURL() later
      var request = new XMLHttpRequest();
      request.open("GET", props.inputFile, true);
      request.responseType = "blob";

      request.onload = function () {
        props.clickFn(request.response);
      };
      request.send();
    }
  };

  return (
    <div>
      <input
        type="button"
        ref={clickRef}
        style={{ display: "none" }}
        onChange={handleClick}
      />
      <button onClick={handleClick}>{props.buttonTxt}</button>
    </div>
  );
}
