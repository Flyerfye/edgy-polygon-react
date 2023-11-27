import React from "react";
import classes from "./InputTextBox.module.css";

interface InputTextBoxProps {
  placeholderText: string;
  value: string;
  onChangeFn: (event: unknown) => void;
}

export default function InputTextBox(props: InputTextBoxProps) {
  return (
    <input
      type="text"
      className={classes.toggleButton}
      placeholder={props.placeholderText}
      value={props.value}
      onChange={props.onChangeFn}
    />
  );
}
