import { Injectable, Logger } from '@nestjs/common';
import { GenerateProofDto } from './dto/generate-zk-proof.dto';
import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';
import type { CompiledCircuit } from '@noir-lang/noir_js';
import { readFileSync } from 'fs';
import { join } from 'path';



@Injectable()
export class ZkProofService {
    private readonly logger = new Logger(ZkProofService.name);

  async generateProof(s: GenerateProofDto) {
    console.log(s);
    const rawCircuitPath = join(process.cwd(), 'public', 'bounding.json');
    const rawCircuit = JSON.parse(readFileSync(rawCircuitPath, 'utf8'));

    const circuit = rawCircuit as CompiledCircuit;
    const noir = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode);
  
    const inputs = {
        lat: BigInt(s.lat).toString(),
        lon: BigInt(s.lon).toString(),
        min_lat: BigInt(s.min_lat).toString(),
        max_lat: BigInt(s.max_lat).toString(),
        min_lon: BigInt(s.min_lon).toString(),
        max_lon: BigInt(s.max_lon).toString(),
        region_hash: BigInt(s.region_hash).toString(),
        challenge: BigInt(s.challenge).toString(),
        nullifier: BigInt(s.nullifier).toString(),
    };
  
    const { witness } = await noir.execute(inputs);
    const proof = await backend.generateProof(witness, { keccak: true });
    this.logger.log("Proof length (bytes):", proof.proof.length);
    this.logger.log("Public inputs length (bytes):", proof.publicInputs.length * 32);
    return { proof };
  }
}
