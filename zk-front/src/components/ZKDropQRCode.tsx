import QRCode from "react-qr-code"
import { useEffect } from "react";
import useCoordinates from "../hooks/useCoordinates";

export function ZKDropQRCode() {
  const { status, error, getQrData, qrData } = useCoordinates();

  useEffect(() => {
    getQrData();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <h1 className="text-xl font-bold mb-4">ZK-Drop Location Proof</h1>
        <p className="text-sm text-gray-700 mb-2">
          To verify your location, scan this QR code with your ZK mobile app.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Your location data will be used to generate a <strong>zero-knowledge proof</strong> to verify your presence without revealing your exact coordinates.
        </p>

        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-lg p-4">
            <QRCode value={qrData} size={256} />
          </div>
        </div>

        {status && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-700">Status: {status}</p>
          </div>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}