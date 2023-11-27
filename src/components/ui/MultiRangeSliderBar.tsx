import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./MultiRangeSliderBarStyles.css";

interface MultiRangeSliderBarProps {
  rerenderId: string;
  name: string;
  tooltip: string;
  min: number;
  max: number;
  customMarks: { [key: number]: string };
  initialValues: number[];
  rerenderFn: (imageParamId: string, imageParamValue: number | number[] | boolean) => void; 
}

export default function MultiRangeSliderBar(props: MultiRangeSliderBarProps) {
  const [values, setValues] = useState<number[]>(props.initialValues);

  const handleSliderChange = (newValues: number[]) => {
    setValues(newValues as number[]);
    props.rerenderFn(props.rerenderId, newValues);
  };

  return (
    <div className="custom-slider-container">
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ width: "30%" }}>
              <div className="tooltip">
                <span className="tooltip">
                  <u>{props.name}</u>
                </span>
                <span className="tooltip-text">{props.tooltip}</span>
              </div>
            </td>
            <td style={{ width: "70%" }}>
              <Slider
                range
                min={props.min}
                max={props.max}
                value={values}
                included={true}
                onChange={handleSliderChange as ((value: number | number[]) => void) | undefined}
                pushable={true}
                marks={props.customMarks}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
