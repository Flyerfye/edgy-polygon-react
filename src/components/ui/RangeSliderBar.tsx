import { useRef } from "react";

export default function RangeSliderBar(props: any) {
  const sliderRef = useRef<HTMLInputElement | null>(null);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.rerenderFn(props.id, sliderRef.current?.value);
  };

  return (
    <div>
      <label htmlFor={props.id}>{props.name} </label>
      <span>[{sliderRef.current?.value || props.defaultValue}]</span>
      <input
        type="range"
        ref={sliderRef}
        id={props.id}
        name={props.name}
        min={props.min}
        max={props.max}
        step={props.step}
        defaultValue={props.defaultValue}
        onChange={handleSliderChange}
      />
    </div>
  );
}
