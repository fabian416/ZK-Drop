import { Injectable, Logger } from '@nestjs/common';
import { GenerateProofDto } from './dto/generate-zk-proof.dto';
import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';
import type { CompiledCircuit } from '@noir-lang/noir_js';
import { readFileSync } from 'fs';
import { join } from 'path';

const parseHex = (val: string) => {
    if (!val) throw new Error("Missing input");
    const normalized = val.startsWith("0x") ? val : `0x${val}`;
    return BigInt(normalized).toString(); // .toString() para pasarlo como input Noir
  };

@Injectable()
export class ZkProofService {
    private readonly logger = new Logger(ZkProofService.name);

  async generateProof(s: GenerateProofDto) {
    const rawCircuitPath = join(process.cwd(), 'public', 'bounding.json');
    const rawCircuit = JSON.parse(readFileSync(rawCircuitPath, 'utf8'));

    const circuit = rawCircuit as CompiledCircuit;
    const noir = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode);
  
    const inputs = {
        lat: parseHex(s.lat),
        lon: parseHex(s.lon),
        min_lat: parseHex(s.min_lat),
        max_lat: parseHex(s.max_lat),
        min_lon: parseHex(s.min_lon),
        max_lon: parseHex(s.max_lon),
        region_hash: parseHex(s.region_hash),
        challenge: parseHex(s.challenge),
        nullifier: parseHex(s.nullifier),
    };
  
    const { witness } = await noir.execute(inputs);
    const proof = await backend.generateProof(witness, { keccak: true });
    this.logger.log("Proof length (bytes):", proof.proof.length);
    this.logger.log("Public inputs length (bytes):", proof.publicInputs.length * 32);

    const { lat, lon, ...publicInputs } = inputs;
    return { proof, inputs: publicInputs };
  }
}
