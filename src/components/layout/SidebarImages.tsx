import classes from './SidebarImages.module.css';

export default function SidebarImages(props:any) {
  return (
      <div>
        <main className={classes.main}>{props.children}</main>
      </div>
  );
};
