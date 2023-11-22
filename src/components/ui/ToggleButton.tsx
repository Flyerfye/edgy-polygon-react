import { useState } from "react";

interface ToggleButtonProps {
  rerenderId: string;
  textA: string;
  textB: string;
  className: string;
  rerenderFn: any;
}

export default function ToggleButton(props: ToggleButtonProps) {
  const [showTextA, setShowTextA] = useState<boolean>(true);
  const TextA = props.textA;
  const TextB = props.textB;

  const handleClick = () => {
    setShowTextA(!showTextA);
    props.rerenderFn(props.rerenderId, showTextA);
  };

  return (
    <button className={props.className} onClick={handleClick}>
      {showTextA && TextA}
      {!showTextA && TextB}
    </button>
  );
}
