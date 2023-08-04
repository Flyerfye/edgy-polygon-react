import { useRef } from "react";

export default function Checkbox(props: any) {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.rerenderFn(props.id, checkboxRef.current?.checked);
  };

  return (
    <div>
      <label htmlFor={props.id}>{props.name} </label>
      <input
        type="checkbox"
        ref={checkboxRef}
        id={props.id}
        name={props.name}
        defaultValue={props.defaultValue}
        onChange={handleCheckboxChange}
      />
    </div>
  );
}
