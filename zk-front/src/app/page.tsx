"use client";
import { useEffect } from "react";
import * as circomlib from "circomlibjs";

// Define module BN254
const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

// Function to convert string into hexadecimal
const bigIntToHexString = (value: BigInt): string => {
  return value.toString(16);
};

// Adapt Poseidon to convert 4 inputs into hash
export const poseidonHash = async (minLat: string, maxLat: string, minLon: string, maxLon: string) => {
  if (!minLat || !maxLat || !minLon || !maxLon) {
    throw new Error("poseidonHash recibió una entrada vacía");
  }

  const poseidon = await circomlib.buildPoseidon();

  // Convert inputs into BigInt and add 0x prefix
  const minLatBigInt = BigInt(`0x${minLat}`);
  const maxLatBigInt = BigInt(`0x${maxLat}`);
  const minLonBigInt = BigInt(`0x${minLon}`);
  const maxLonBigInt = BigInt(`0x${maxLon}`);

  console.log({ minLat, minLatBigInt });
  console.log({ maxLat, maxLatBigInt });
  console.log({ minLon, minLonBigInt });
  console.log({ maxLon, maxLonBigInt });

  // Validate the inputs
  if (
    minLatBigInt >= FIELD_MODULUS ||
    maxLatBigInt >= FIELD_MODULUS ||
    minLonBigInt >= FIELD_MODULUS ||
    maxLonBigInt >= FIELD_MODULUS
  ) {
    throw new Error('One on the inputs exceeds the field modulus');
  }

  const hash = poseidon([minLatBigInt, maxLatBigInt, minLonBigInt, maxLonBigInt]);
  return hash;
};

// Convert hash to hexadecimal with 0x prefix
export const convertHashToHex = async (hash: any) => {
  const poseidon = await circomlib.buildPoseidon();
  return `0x${poseidon.F.toObject(hash).toString(16)}`;
};

export default function Home() {
  useEffect(() => {
    const generateUSAHashes = async () => {
      // Coords USA (approx)
      const minLat = BigInt(24396308);    // 24.396308
      const maxLat = BigInt(49384358);    // 49.384358
      const minLon = BigInt(-124848974);  // -124.848974
      const maxLon = BigInt(-66934578);   // -66.934578

      // Adjust negative values
      const adjustedMinLon = (minLon + FIELD_MODULUS) % FIELD_MODULUS;
      const adjustedMaxLon = (maxLon + FIELD_MODULUS) % FIELD_MODULUS;

      // Convertir los valores a hexadecimal (sin el prefijo "0x" para pasar a poseidonHash)
      const minLatHex = bigIntToHexString(minLat);
      const maxLatHex = bigIntToHexString(maxLat);
      const adjustedMinLonHex = bigIntToHexString(adjustedMinLon);
      const adjustedMaxLonHex = bigIntToHexString(adjustedMaxLon);

      // Calcular regionHash usando la función poseidonHash
      const regionHash = await poseidonHash(minLatHex, maxLatHex, adjustedMinLonHex, adjustedMaxLonHex);

      // Imprimir valores en formato hexadecimal con prefijo "0x"
      console.log("minLat (hex):", `0x${minLatHex}`);
      console.log("maxLat (hex):", `0x${maxLatHex}`);
      console.log("minLon (adjusted hex):", `0x${adjustedMinLonHex}`);
      console.log("maxLon (adjusted hex):", `0x${adjustedMaxLonHex}`);
      console.log("regionHash (hex):", await convertHashToHex(regionHash));
    };

    generateUSAHashes().catch(console.error);
  }, []);

  return <main className="p-10">Generating public inputs for USA…</main>;
}