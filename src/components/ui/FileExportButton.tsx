export default function FileExportButton(props: any) {
  const handleClick = () => {
    props.rerenderFn(props.rerenderId, true);
    props.clickFn();
  };

  return (
    <button className={props.className} onClick={handleClick}>Save Image</button>
  );
}
