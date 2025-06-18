import QRCode from "react-qr-code"
import { useState, useEffect } from "react";
import axios from "axios";

export function ZKDropQRCode() {
  const [qrData, setQrData] = useState("");

  const backendUrl = "http://localhost:5000";

  const getQrData = async () => {
    const response = await axios.get(`${backendUrl}/relay-session`);
    const data = response.data;
    console.log(data);
    setQrData(`${backendUrl}/relay-session/${data}`);
  }
  
  useEffect(() => {
    getQrData();
  }, []);

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-4">
        Scan this QR code with your ZK mobile app to generate the proof.
      </p>
      <div className="inline-block p-4 bg-white rounded-lg border shadow">
        <QRCode value={qrData} size={200} />
      </div>
    </div>
  )
}