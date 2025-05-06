import * as circomlib from 'circomlibjs';

const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

export const poseidonHash4 = async (inputs: number[]): Promise<string> => {
  if (inputs.length !== 4) {
    throw new Error('poseidonHash4 expects exactly 4 inputs');
  }

  const poseidon = await circomlib.buildPoseidon();
  for (const input of inputs) {
    if (BigInt(input) >= FIELD_MODULUS) {
      throw new Error(`Input ${input} exceeds FIELD_MODULUS`);
    }
  }

  const hash = poseidon(inputs.map(BigInt));
  return poseidon.F.toObject(hash).toString();
};

export const poseidonHash2 = async (inputs: (number | string)[]): Promise<string> => {
  if (inputs.length !== 2) {
    throw new Error('poseidonHash2 expects exactly 2 inputs');
  }

  const poseidon = await circomlib.buildPoseidon();
  for (const input of inputs) {
    if (BigInt(input) >= FIELD_MODULUS) {
      throw new Error(`Input ${input} exceeds FIELD_MODULUS`);
    }
  }

  const hash = poseidon(inputs.map(BigInt));
  return poseidon.F.toObject(hash).toString();
};