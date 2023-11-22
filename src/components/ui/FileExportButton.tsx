interface FileExportButtonProps {
  className: string;
  clickFn: any;
}

export default function FileExportButton(props: FileExportButtonProps) {
  const handleClick = () => {
    props.clickFn();
  };

  return (
    <button className={props.className} onClick={handleClick}>
      Save Image
    </button>
  );
}
