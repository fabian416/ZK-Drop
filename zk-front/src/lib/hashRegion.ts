import * as circomlib from 'circomlibjs';

export async function hashRegion(minLat: bigint, maxLat: bigint, minLon: bigint, maxLon: bigint) {
  const poseidon = await circomlib.buildPoseidon();
  const hash = poseidon([minLat, maxLat, minLon, maxLon]);
  return poseidon.F.toString(hash);
}