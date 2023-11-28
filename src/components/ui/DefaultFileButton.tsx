import React from "react";
import BirbImage from '../../assets/images/Birb.jpg';

interface DefaultFileButtonProps {
  className: string;
  buttonTxt: string;
  id: string;
  clickFn: (file: File) => void;
}

export default function DefaultFileButton(props: DefaultFileButtonProps) {
  const handleClick = () => {

    // Fetch the image file
    fetch(BirbImage)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "Birb.jpg", { type: "image/jpeg" });

        props.clickFn(file);
      })
      .catch((error) => console.error("Error fetching the image:", error));
  };

  return (
    <button
      className={props.className}
      id={props.id}
      data-testid={props.id}
      onClick={handleClick}
    >
      {props.buttonTxt}
    </button>
  );
}
