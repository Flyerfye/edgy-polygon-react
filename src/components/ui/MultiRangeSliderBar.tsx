import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./MultiRangeSliderBarStyles.css";

// interface MultiRangeSliderProps {
//   min: number;
//   max: number;
// }

export default function MultiRangeSliderBar(props) {
  const [values, setValues] = useState<number[]>(props.values);

  const handleSliderChange = (newValues: number[]) => {
    setValues(newValues as number[]);
    props.rerenderFn(props.id, newValues);
  };

  return (
    <div className="custom-slider-container">
      <table style={{ width: "100%" }}>
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
              onChange={handleSliderChange as any}
              pushable={true}
              marks={props.customMarks}
            />
          </td>
        </tr>
      </table>
    </div>
  );
}
