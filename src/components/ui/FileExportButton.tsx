import React from "react";

interface FileExportButtonProps {
  className: string;
  id:string;
  clickFn: () => void;
}

export default function FileExportButton(props: FileExportButtonProps) {
  const handleClick = () => {
    props.clickFn();
  };

  return (
    <button className={props.className} id={props.id} data-testid={props.id} onClick={handleClick}>
      Save Image
    </button>
  );
}
