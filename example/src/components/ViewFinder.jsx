import React from 'react';

export const ViewFinder = (props) => {
  return (
    <view-finder 
      left={props.left}
      top={props.top}
      right={props.right}
      bottom={props.bottom}
      height={props.height}
      width={props.width}
      preserve-aspect-ratio={props.preserveAspectRatio}
    >
    </view-finder>
  );
}