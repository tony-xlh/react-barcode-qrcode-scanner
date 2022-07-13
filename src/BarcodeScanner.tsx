import React from 'react';
import { CameraProps, VisionCamera } from 'react-vision-camera';

export interface ScannerProps extends CameraProps{
  runtimeSettings?: string;
  license?: string;
}

const BarcodeScanner = (props:ScannerProps): React.ReactElement => {
  
  React.useEffect(()=>{
    console.log("scanner mounted");
  },[])

  
  return (
    <VisionCamera
      isActive={props.isActive}
      facingMode={props.facingMode}
      desiredCamera={props.desiredCamera}
      desiredResolution={props.desiredResolution}
      onOpened={props.onOpened}
      onClosed={props.onClosed}
      onDeviceListLoaded={props.onDeviceListLoaded}
    >
      {props.children}
    </VisionCamera>
  )
}

export default BarcodeScanner;