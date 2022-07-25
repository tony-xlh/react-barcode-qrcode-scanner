import { BarcodeScanner } from "react-barcode-qrcode-scanner";
import React from 'react';
import "./App.css";
import loading from "./loading.svg"
import { BarcodeReader, EnumBarcodeFormat, TextResult } from "dynamsoft-javascript-barcode";
import { ViewFinder } from "./components/ViewFinder";

const presetResolutions = [
  {label:"ask 1920x1080", value:{width:1920,height:1080}},
  {label:"ask 1280x720", value:{width:1280,height:720}},
  {label:"ask 640x480", value:{width:640,height:480}}
]

function App() {
  const [isActive,setIsActive] = React.useState(true);
  const [initialized,setInitialized] = React.useState(false);
  const [opened,setOpened] = React.useState(false);
  const [cameras,setCameras] = React.useState([] as MediaDeviceInfo[]);
  const [selectedCameraLabel,setSelectedCameraLabel] = React.useState("");
  const [desiredCamera, setDesiredCamera] = React.useState("back");
  const [desiredResolution, setDesiredResolution] = React.useState({width:1280,height:720});
  const [currentResolution, setCurrentResolution] = React.useState("");
  const [currentVideoWidth, setCurrentVideoWidth] = React.useState(1280);
  const [currentVideoHeight, setCurrentVideoHeight] = React.useState(720);
  const [scanRegion, setScanRegion] = React.useState({"left":200,"top":200,"width":200,"height":200});
  const reader = React.useRef(null as null | BarcodeReader);
  const resSel = React.useRef(null);
  const camSel = React.useRef(null);
  const viewFinder = React.useRef(null);
  const onOpened = (cam:HTMLVideoElement,camLabel:string) => {
    console.log("opened");
    console.log(camLabel);
    setOpened(true);
    setCurrentResolution(cam.videoWidth+"x"+cam.videoHeight);
    setCurrentVideoWidth(cam.videoWidth);
    setCurrentVideoHeight(cam.videoHeight);
    setSelectedCameraLabel(camLabel);

    let x;
    let y;
    let w;
    let h;
    if (cam.videoWidth>cam.videoHeight) {
      x = cam.videoWidth*0.25;
      y = cam.videoHeight*0.25;
      w = cam.videoWidth*0.5;
      h = cam.videoHeight*0.5;
    }else{
      x = cam.videoWidth*0.15;
      y = cam.videoHeight*0.2;
      w = cam.videoWidth*0.70;
      h = cam.videoHeight*0.4;
    }
    const region = {"left":x,"top":y,"width":w,"height":h};
    console.log(region)
    setScanRegion(region);
    updateRuntimeSettingsForScanRegion(region);
  }

  const updateRuntimeSettingsForScanRegion = async (region:{left:number,top:number,width:number,height:number}) => {
    if (reader.current) {
      const settings = await reader.current.getRuntimeSettings();
      settings.region.regionLeft = region.left;
      settings.region.regionTop = region.top;
      settings.region.regionBottom = region.top + region.height;
      settings.region.regionRight = region.left + region.width;
      settings.region.regionMeasuredByPercentage = 0;
      await reader.current.updateRuntimeSettings(settings);
    }else{
      console.log("waiting for barcode reader to be initialized.")
      setTimeout(updateRuntimeSettingsForScanRegion,500,region);
    }
  }

  const onClosed = () => {
    console.log("closed");
    setOpened(false);
  }

  const onScanned = (results:TextResult[]) => {
    console.log(results);
  }

  const onDeviceListLoaded = (devices:MediaDeviceInfo[]) => {
    console.log(devices);
    setCameras(devices);
  }

  const onCameraSelected = (e:any) => {
    setDesiredCamera(e.target.value);
    setSelectedCameraLabel(e.target.value);
  }

  const onResolutionSelected = (e:any) => {
    const width = e.target.value.split("x")[0];
    const height = e.target.value.split("x")[1];
    setDesiredResolution({width:width,height:height})
  }

  const onClicked = (result:TextResult) => {
    alert(result.barcodeText);
  }

  const onInitialized = (dbr:BarcodeReader) => {
    reader.current = dbr;
    setInitialized(true);
  }

  const scanQRCodeChanged = async (e:any) => {
    if (reader.current) {
      const settings = await reader.current.getRuntimeSettings();
      if (e.target.checked === true) {
        settings.barcodeFormatIds = EnumBarcodeFormat.BF_QR_CODE;
      }else{
        settings.barcodeFormatIds = EnumBarcodeFormat.BF_ALL;
      }
      await reader.current.updateRuntimeSettings(settings);
    }
    
  }

  return (
    <div className="container">
      <div className="barcode-scanner">
        <div className="vision-camera">
          <BarcodeScanner 
            isActive={isActive}
            drawOverlay={true}
            desiredCamera={desiredCamera}
            desiredResolution={desiredResolution}
            onScanned={onScanned}
            onOpened={onOpened}
            onClosed={onClosed}
            onClicked={onClicked}
            onDeviceListLoaded={onDeviceListLoaded}
            onInitialized={onInitialized}
          >
            {((initialized && opened) && isActive) &&
              <ViewFinder 
                ref={viewFinder}
                width={currentVideoWidth}
                height={currentVideoHeight}
                preserveAspectRatio="xMidYMid slice"
                scanRegion={scanRegion}
              >
              </ViewFinder>
            }
            {((!initialized || !opened) && isActive) &&
              <img src={loading} className="loading" alt="loading" />
            }
          </BarcodeScanner>
        </div>
        <div>
          <div>
            <select ref={resSel} value={currentResolution} onChange={(e) => onResolutionSelected(e)} >
              <option value={currentResolution}>
                {"got "+currentResolution}
              </option>
              {presetResolutions.map((res,idx) => (
                <option key={idx} value={res.value.width+"x"+res.value.height}>
                  {res.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select ref={camSel} value={selectedCameraLabel} onChange={(e) => onCameraSelected(e)}>
              {cameras.map((camera,idx) => (
                <option key={idx} value={camera.label}>{camera.label}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setIsActive(!isActive)}>{isActive ? "Stop" : "Start"}</button>
          <label><input type="checkbox" onChange={(e) => scanQRCodeChanged(e)}></input>Scan QR codes only</label>
        </div>
      </div>
    </div>
  );
}

export default App;

