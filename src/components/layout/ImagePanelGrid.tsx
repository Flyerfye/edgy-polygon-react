import classes from './ImagePanelGrid.module.css';

export default function ImagePanelGrid(props:any) {
  function beforeCall() {
    // console.log('before ' + 'ImagePanelGrid');
    return "";
  }
  
  function afterCall() {
    // console.log('after ' + 'ImagePanelGrid');
    return "";
  }


    return (
        <div>
          {beforeCall()}
          <main className={classes.main}>{props.children}</main>
          {afterCall()}
        </div>
    );
}
