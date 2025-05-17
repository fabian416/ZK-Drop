import * as circomlib from "circomlibjs";

const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

const bigIntToHexString = (value: bigint): string => {
  const adjusted = value >= 0n ? value : (value + FIELD_MODULUS) % FIELD_MODULUS
  return `0x${adjusted.toString(16)}`
}

export const poseidonHash = async (minLat: string, maxLat: string, minLon: string, maxLon: string) => {
  const poseidon = await circomlib.buildPoseidon()
  const parseField = (x: string) => BigInt(x.startsWith("0x") ? x : `0x${x}`)
  return poseidon([
    parseField(minLat),
    parseField(maxLat),
    parseField(minLon),
    parseField(maxLon),
  ])
}

export const poseidonHash2 = async (a: bigint, b: bigint) => {
  const poseidon = await circomlib.buildPoseidon()
  return poseidon([a, b])
}

export const convertHashToHex = async (hash: unknown): Promise<string> => {
  const poseidon = await circomlib.buildPoseidon()
  return `0x${poseidon.F.toObject(hash).toString(16)}`
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
    min_lat: minLatHex,
    max_lat: maxLatHex,
    min_lon: minLonHex,
    max_lon: maxLonHex,
    region_hash: regionHashHex,
    challenge: "0x3039",
    nullifier: sessionHashHex
  };
};

export const getPrivateInputs = async ({ lat, lon }) => {
  const latBigInt = BigInt(lat);
  const lonBigInt = BigInt(lon);

  const adjustedLat = latBigInt < 0n ? (latBigInt + FIELD_MODULUS) % FIELD_MODULUS : latBigInt;
  const adjustedLon = lonBigInt < 0n ? (lonBigInt + FIELD_MODULUS) % FIELD_MODULUS : lonBigInt;

  return {
    lat: `0x${adjustedLat.toString(16)}`,
    lon: `0x${adjustedLon.toString(16)}`,
  };
};


export const getPublicInputsForArgentina = async () => {
  const rawMinLat = BigInt(-55000000);
  const rawMaxLat = BigInt(-20000000);
  const rawMinLon = BigInt(-80000000);
  const rawMaxLon = BigInt(-50000000);

  const minLat = (rawMinLat + FIELD_MODULUS) % FIELD_MODULUS;
  const maxLat = (rawMaxLat + FIELD_MODULUS) % FIELD_MODULUS;
  const minLon = (rawMinLon + FIELD_MODULUS) % FIELD_MODULUS;
  const maxLon = (rawMaxLon + FIELD_MODULUS) % FIELD_MODULUS;

  const minLatHex = bigIntToHexString(minLat);
  const maxLatHex = bigIntToHexString(maxLat);
  const minLonHex = bigIntToHexString(minLon);
  const maxLonHex = bigIntToHexString(maxLon);

  const regionHash = await poseidonHash(minLatHex, maxLatHex, minLonHex, maxLonHex);
  const regionHashHex = await convertHashToHex(regionHash);

  const challenge = BigInt(12345);
  const sessionHashRaw = await poseidonHash2(BigInt(regionHashHex), challenge);
  const sessionHashHex = await convertHashToHex(sessionHashRaw);

  return {
    min_lat: minLatHex,
    max_lat: maxLatHex,
    min_lon: minLonHex,
    max_lon: maxLonHex,
    region_hash: regionHashHex,
    challenge: "0x3039",
    nullifier: sessionHashHex,
  };
};
