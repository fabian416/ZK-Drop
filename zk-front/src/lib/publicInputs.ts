import * as circomlib from "circomlibjs";

const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

const bigIntToHexString = (value: bigint): string => {
  return value.toString(16);
};

export const poseidonHash = async (minLat: string, maxLat: string, minLon: string, maxLon: string) => {
  const poseidon = await circomlib.buildPoseidon();
  return poseidon([
    BigInt(`0x${minLat}`),
    BigInt(`0x${maxLat}`),
    BigInt(`0x${minLon}`),
    BigInt(`0x${maxLon}`)
  ]);
};

export const poseidonHash2 = async (a: bigint, b: bigint) => {
  const poseidon = await circomlib.buildPoseidon();
  return poseidon([a, b]);
};

export const convertHashToHex = async (hash: unknown): Promise<string> => {
    const poseidon = await circomlib.buildPoseidon();
    return `0x${poseidon.F.toObject(hash).toString(16)}`;
  }

export const getPublicInputsForUSA = async () => {
  const minLat = BigInt(24396308); // 24.396308
  const maxLat = BigInt(49384358); // 49.384358
  const minLon = BigInt(-124848974); // -124.848974
  const maxLon = BigInt(-66934578);  // -66.934578

  const adjustedMinLon = (minLon + FIELD_MODULUS) % FIELD_MODULUS;
  const adjustedMaxLon = (maxLon + FIELD_MODULUS) % FIELD_MODULUS;

  const minLatHex = bigIntToHexString(minLat);
  const maxLatHex = bigIntToHexString(maxLat);
  const minLonHex = bigIntToHexString(adjustedMinLon);
  const maxLonHex = bigIntToHexString(adjustedMaxLon);

  const regionHash = await poseidonHash(minLatHex, maxLatHex, minLonHex, maxLonHex);
  const regionHashHex = await convertHashToHex(regionHash);

  const challenge = BigInt(12345);
  const sessionHashRaw = await poseidonHash2(BigInt(regionHashHex), challenge);
  const sessionHashHex = await convertHashToHex(sessionHashRaw);

  return {
    min_lat: `0x${minLatHex}`,
    max_lat: `0x${maxLatHex}`,
    min_lon: `0x${minLonHex}`,
    max_lon: `0x${maxLonHex}`,
    region_hash: regionHashHex,
    challenge: "0x3039",
    session_hash: sessionHashHex
  };
};

export const getPublicInputsForArgentina = async () => {
    const minLat = BigInt(-55000000); // ejemplo: -55.000000
    const maxLat = BigInt(-20000000); // -20.000000
    const minLon = BigInt(-80000000); // -80.000000
    const maxLon = BigInt(-50000000); // -50.000000
  
    const adjustedMinLon = (minLon + FIELD_MODULUS) % FIELD_MODULUS;
    const adjustedMaxLon = (maxLon + FIELD_MODULUS) % FIELD_MODULUS;
  
    const minLatHex = bigIntToHexString(minLat);
    const maxLatHex = bigIntToHexString(maxLat);
    const minLonHex = bigIntToHexString(adjustedMinLon);
    const maxLonHex = bigIntToHexString(adjustedMaxLon);
  
    const regionHash = await poseidonHash(minLatHex, maxLatHex, minLonHex, maxLonHex);
    const regionHashHex = await convertHashToHex(regionHash);
  
    const challenge = BigInt(12345);
    const sessionHashRaw = await poseidonHash2(BigInt(regionHashHex), challenge);
    const sessionHashHex = await convertHashToHex(sessionHashRaw);
  
    return {
      min_lat: `0x${minLatHex}`,
      max_lat: `0x${maxLatHex}`,
      min_lon: `0x${minLonHex}`,
      max_lon: `0x${maxLonHex}`,
      region_hash: regionHashHex,
      challenge: "0x3039",
      session_hash: sessionHashHex
    };
  };