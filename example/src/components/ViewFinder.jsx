import React from 'react';

export const ViewFinder = (props) => {
  const viewFinder = React.useRef(null);

  React.useEffect(()=>{
    if (props.style) {
      viewFinder.current.style = props.style;
    }
  },[props.style])

  React.useEffect(()=>{
    if (props.scanRegion) {
      console.log(viewFinder.current);
      console.log(props.scanRegion);
      viewFinder.current.scanRegion = props.scanRegion;
    }
  },[props.scanRegion])

  React.useEffect(()=>{
    if (props.width && props.height) {
      viewFinder.current.width = props.width;
      viewFinder.current.height = props.height;
    }
  },[props.width,props.height])

  React.useEffect(()=>{
    if (props.preserveAspectRatio) {
      viewFinder.current.preserveAspectRatio = props.preserveAspectRatio;
    }
  },[props.preserveAspectRatio])

  return (
    <view-finder 
      ref={viewFinder}>
    </view-finder>
  );
}