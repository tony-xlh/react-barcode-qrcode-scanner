import { BarcodeReader, TextResult } from 'dynamsoft-javascript-barcode';
import React from 'react';
import { CameraProps, VisionCamera } from 'react-vision-camera';

export interface ScannerProps extends CameraProps{
  runtimeSettings?: string;
  license?: string;
  engineResourcePath?: string;
  interval?:number;
  drawOverlay?: boolean;
  onInitialized?: (reader:BarcodeReader) => void;
  onScanned?: (results:TextResult[]) => void;
  onClicked?: (result:TextResult) => void;
}

const BarcodeScanner = (props:ScannerProps): React.ReactElement => {
  const interval = React.useRef(null);
  const camera = React.useRef(null);
  const reader = React.useRef(null);
  const mounted = React.useRef(false);
  const decoding = React.useRef(false);
  const [viewBox, setViewBox] = React.useState("0 0 1280 720");
  const [barcodeResults, setBarcodeResults] = React.useState([] as TextResult[]);
  
  React.useEffect(()=>{
    const init = async () => {
      if (props.license) {
        BarcodeReader.license = props.license;
      }else{
        BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="; // public trial license
      }
      if (props.engineResourcePath) {
        BarcodeReader.engineResourcePath = props.engineResourcePath;
      }else{
        BarcodeReader.engineResourcePath = "https://unpkg.com/dynamsoft-javascript-barcode@latest/dist/";
      }
      
      reader.current = await BarcodeReader.createInstance();
      if (props.runtimeSettings) {
        await (reader.current as BarcodeReader).initRuntimeSettingsWithString(props.runtimeSettings);
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
      (reader.current as BarcodeReader).initRuntimeSettingsWithString(props.runtimeSettings);
    }
  },[props.runtimeSettings])

  const startScanning = () => {
    const decode = async () => {
      if (decoding.current === false && reader.current && camera.current) {
        decoding.current = true;
        const results = await reader.current.decode(camera.current);
        setBarcodeResults(results);
        if (props.onScanned) {
          props.onScanned(results);
        }
        decoding.current = false;
      }
    }
    if (props.interval) {
      interval.current = setInterval(decode,props.interval);
    }else{
      interval.current = setInterval(decode,40);
    }
    
  }

  const stopScanning = () => {
    clearInterval(interval.current);
  }

  const onOpened = (cam:HTMLVideoElement,camLbl:string) => {
    camera.current = cam;
    setViewBox("0 0 "+cam.videoWidth+" "+cam.videoHeight);
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

  const onPolygonClicked = (result:TextResult) => {
    if (props.onClicked) {
      props.onClicked(result);
    }
  }

  const getPointsData = (result:TextResult) => {
    const lr = result.localizationResult;
    let pointsData = lr.x1+","+lr.y1 + " ";
    pointsData = pointsData+ lr.x2+","+lr.y2 + " ";
    pointsData = pointsData+ lr.x3+","+lr.y3 + " ";
    pointsData = pointsData+ lr.x4+","+lr.y4;
    return pointsData;
  }

  const renderSVGOverlay = () => {
    if (props.drawOverlay === true && barcodeResults.length>0) {
      return (
        <svg 
        preserveAspectRatio="xMidYMid slice"
        viewBox={viewBox}
        xmlns="<http://www.w3.org/2000/svg>"
        style={{
          position:'absolute',
          top: 0,
          left: 0,
          width:'100%',
          height:'100%'}}>
        {barcodeResults.map((result,idx) => (
          <polygon key={"poly-"+idx} xmlns="<http://www.w3.org/2000/svg>"
          points={getPointsData(result)}
          onClick={() => onPolygonClicked(result)}
          style={{
            fill:"rgba(85,240,40,0.5)",
            stroke: "green",
            strokeWidth: 1
          }}
          />
        ))}
        {barcodeResults.map((result,idx) => (
          <text key={"text-"+idx} xmlns="<http://www.w3.org/2000/svg>"
          x={result.localizationResult.x1}
          y={result.localizationResult.y1}
          fill="red"
          fontSize="20"
          >{result.barcodeText}</text>
        ))}
      </svg>
      )
    }
  }
  
  return (
    <VisionCamera
      isActive={props.isActive}
      isPause={props.isPause}
      facingMode={props.facingMode}
      desiredCamera={props.desiredCamera}
      desiredResolution={props.desiredResolution}
      onOpened={onOpened}
      onClosed={onClosed}
      onDeviceListLoaded={props.onDeviceListLoaded}
    >
      {props.children}
      {renderSVGOverlay()}
    </VisionCamera>
  )
}

export default BarcodeScanner;