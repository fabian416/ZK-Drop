'use client';

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { hashRegion } from "@/lib/hashRegion"; // Ajusta ruta si es necesario

export default function Home() {
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const minLat = BigInt(-3500000);
      const maxLat = BigInt(-2000000);
      const minLon = BigInt(-7000000);
      const maxLon = BigInt(-5000000);
      const challenge = BigInt(Date.now()); // ejemplo único

      const regionHash = await hashRegion(minLat, maxLat, minLon, maxLon);
      const sessionHash = await hashRegion(BigInt(regionHash), challenge, BigInt(0), BigInt(0)); // reutilizamos misma función para hash_2

      const data = {
        minLat: minLat.toString(),
        maxLat: maxLat.toString(),
        minLon: minLon.toString(),
        maxLon: maxLon.toString(),
        regionHash,
        challenge: challenge.toString(),
        sessionHash,
      };

      setQrData(JSON.stringify(data));
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12">
      <h1 className="text-2xl mb-4">Scan this QR with your ZK mobile app</h1>
      {qrData ? (
        <QRCodeCanvas value={qrData} size={256} />
      ) : (
        <p>Generating QR...</p>
      )}
    </div>
  );
}