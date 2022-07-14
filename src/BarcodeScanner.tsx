import { BarcodeReader, TextResult } from 'dynamsoft-javascript-barcode';
import React from 'react';
import { CameraProps, VisionCamera } from 'react-vision-camera';

export interface ScannerProps extends CameraProps{
  runtimeSettings?: string;
  license?: string;
  onInitialized?: (reader:BarcodeReader) => void;
  onScanned?: (results:TextResult[]) => void;
}

const BarcodeScanner = (props:ScannerProps): React.ReactElement => {
  const interval = React.useRef(null);
  const camera = React.useRef(null);
  const reader = React.useRef(null);
  const mounted = React.useRef(false);
  const decoding = React.useRef(false);
  
  React.useEffect(()=>{
    const init = async () => {
      if (props.license) {
        BarcodeReader.license = props.license;
      }
      BarcodeReader.engineResourcePath = "https://unpkg.com/dynamsoft-javascript-barcode@9.0.2/dist/";
      reader.current = await BarcodeReader.createInstance();
      if (props.runtimeSettings) {
        await reader.current.updateRuntimeSettings(props.runtimeSettings);
      }
      if (props.onInitialized) {
        props.onInitialized(reader.current);
      }
    }
    init();
    mounted.current = true;
  },[])

  React.useEffect(()=>{
    if (props.runtimeSettings && reader.current) {
      reader.current.updateRuntimeSettings(props.runtimeSettings);
    }
  },[props.runtimeSettings])

  const startScanning = () => {
    const decode = async () => {
      if (decoding.current === false && reader.current && camera.current) {
        decoding.current = true;
        const results = await reader.current.decode(camera.current);
        if (props.onScanned) {
          props.onScanned(results);
        }
        decoding.current = false;
      }
    }
    interval.current = setInterval(decode,40);
  }

  const stopScanning = () => {
    clearInterval(interval.current);
  }

  const onOpened = (cam:HTMLVideoElement,camLbl:string) => {
    camera.current = cam;
    startScanning();
    if (props.onOpened) {
      props.onOpened(cam,camLbl);
    }
  }

  const onClosed = () => {
    stopScanning();
    if (props.onClosed) {
      props.onClosed();
    }
  }
  
  return (
    <VisionCamera
      isActive={props.isActive}
      facingMode={props.facingMode}
      desiredCamera={props.desiredCamera}
      desiredResolution={props.desiredResolution}
      onOpened={onOpened}
      onClosed={onClosed}
      onDeviceListLoaded={props.onDeviceListLoaded}
    >
      {props.children}
    </VisionCamera>
  )
}

export default BarcodeScanner;