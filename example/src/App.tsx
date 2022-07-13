import { BarcodeScanner } from "react-barcode-qrcode-scanner";

function App() {
  return (
    <div style={{width:"500px",height:"500px"}}>
      <BarcodeScanner
        isActive={true}
        desiredCamera="founder"
      >

      </BarcodeScanner>
    </div>
  );
}

export default App;
