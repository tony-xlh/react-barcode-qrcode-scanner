# react-barcode-qrcode-scanner

![version](https://img.shields.io/npm/v/react-barcode-qrcode-scanner.svg)
![downloads](https://img.shields.io/npm/dm/react-barcode-qrcode-scanner.svg)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/react-barcode-qrcode-scanner.svg)

Barcode and QR Code Scanner Component for React. It uses [react-vision-camera](https://github.com/xulihang/react-vision-camera) to access the camera and [Dynamsoft Barcode Reader](https://www.dynamsoft.com/barcode-reader/overview/) to read barcodes.


[Online demo](https://rainbow-moonbeam-f7ef52.netlify.app/)

### Installation

```
npm install react-barcode-qrcode-scanner
```

### Usage

```jsx
import { BarcodeScanner } from "react-barcode-qrcode-scanner";
import { TextResult } from "dynamsoft-javascript-barcode";

function App() {
  const [isActive,setIsActive] = React.useState(true); //whether the camera is active
  const [isPause,setIsPause] = React.useState(false); //whether the video is paused
  const [runtimeSettings,setRuntimeSettings] = React.useState("{\"ImageParameter\":{\"BarcodeFormatIds\":[\"BF_QR_CODE\"],\"Description\":\"\",\"Name\":\"Settings\"},\"Version\":\"3.0\"}"); //use JSON template to decode QR codes only
  const onOpened = (cam:HTMLVideoElement,camLabel:string) => { // You can access the video element in the onOpened event
    console.log("opened"); 
  }

  const onClosed = () => {
    console.log("closed");
  }
  
  const onDeviceListLoaded = (devices:MediaDeviceInfo[]) => {
    console.log(devices);
  }
  
  const onScanned = (results:TextResult[]) => { // barcode results
    console.log(results);
  }
  
  const onClicked = (result:TextResult) => { // when a barcode overlay is clicked
    alert(result.barcodeText);
  }

  const onInitialized = () => { // when the Barcode Reader is initialized
    setInitialized(true);
  }
  
  return (
    <div>
      <BarcodeScanner 
        isActive={isActive}
        isPause={isPause}
        license="license key for Dynamsoft Barcode Reader"
        drawOverlay={true}
        desiredCamera="back"
        desiredResolution={{width:1280,height:720}}
        runtimeSettings={runtimeSettings}
        onScanned={onScanned}
        onClicked={onClicked}
        onOpened={onOpened}
        onClosed={onClosed}
        onInitialized={onInitialized}
        onDeviceListLoaded={onDeviceListLoaded}
      >
      </BarcodeScanner>
    </div>
  )
}

```

### FAQ

How to specify which camera to use?

1. Use the `desiredCamera` prop. If one of the camera's name contains it, then it will be used. You can get the devices list in the `onDeviceListLoaded` event.
2. Use the `facingMode` prop. Set it to `environment` to use the back camera. Set it to `user` to use the front camera. Please note that this is not supported on Desktop.

You can use the two props together. `facingMode` has a higher priority.

### Blog

[How to Create a React Barcode and QR Code Scanning Library](https://www.dynamsoft.com/codepool/react-barcode-qr-code-scanner-library.html)

### License

MIT
