import { BarcodeScanner } from "react-barcode-qrcode-scanner";
import React from 'react';
import "./App.css";
import { TextResult } from "dynamsoft-javascript-barcode";

const presetResolutions = [
  {label:"ask 1920x1080", value:{width:1920,height:1080}},
  {label:"ask 1280x720", value:{width:1280,height:720}},
  {label:"ask 640x480", value:{width:640,height:480}}
]

function App() {
  const [isActive,setIsActive] = React.useState(true);
  const [cameras,setCameras] = React.useState([] as MediaDeviceInfo[]);
  const [selectedCameraLabel,setSelectedCameraLabel] = React.useState("");
  const [desiredCamera, setDesiredCamera] = React.useState("back");
  const [desiredResolution, setDesiredResolution] = React.useState({width:1280,height:720});
  const [currentResolution, setCurrentResolution] = React.useState("");
  const resSel = React.useRef(null);
  const camSel = React.useRef(null);
  const onOpened = (cam:HTMLVideoElement,camLabel:string) => {
    console.log("opened");
    console.log(camLabel);
    setCurrentResolution(cam.videoWidth+"x"+cam.videoHeight);
    setSelectedCameraLabel(camLabel);
  }

  const onClosed = () => {
    console.log("closed");
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

  return (
    <div className="container">
      <div className="barcode-scanner">
        <div className="vision-camera">
          <BarcodeScanner 
            isActive={isActive}
            desiredCamera={desiredCamera}
            desiredResolution={desiredResolution}
            onScanned={onScanned}
            onOpened={onOpened}
            onClosed={onClosed}
            onDeviceListLoaded={onDeviceListLoaded}
          >
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
        </div>
      </div>
    </div>
  );
}

export default App;

