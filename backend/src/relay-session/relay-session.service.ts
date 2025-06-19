import { Injectable, NotFoundException } from '@nestjs/common';
import { RelaySession } from './entities/relay-session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateRelaySessionDto } from './dto/updateRelaySession.dto';
import { ZkProofService } from 'src/zk-proof/zk-proof.service';
import * as circomlib from 'circomlibjs';

@Injectable()
export class RelaySessionService {
    private readonly FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

    constructor(
        @InjectRepository(RelaySession)
        private relaySessionRepository: Repository<RelaySession>,
        private readonly zkProofService: ZkProofService,
    ) {}

    async createRelaySession(): Promise<RelaySession> {
        const relaySession = this.relaySessionRepository.create();
        return await this.relaySessionRepository.save(relaySession);
    }

    async updateRelaySession(id: string, dto: UpdateRelaySessionDto): Promise<RelaySession> {
        const relaySession = await this.relaySessionRepository.findOne({ where: { id } });
        if (!relaySession) {
            throw new NotFoundException('Relay session not found');
        }

        const publicInputs = await this.getPublicInputsForBerlin();
        const {lat, lon} = await this.getPrivateInputs({
            lat: '52516000',
            lon: '13377000' 
        });
        const proof = await this.zkProofService.generateProof({ ...publicInputs, lat, lon });

        relaySession.value = dto.value;
        return await this.relaySessionRepository.save(relaySession);
    }


    getPrivateInputs = async ({ lat, lon }) => {
        const latBigInt = BigInt(lat);
        const lonBigInt = BigInt(lon);
      
        const adjustedLat = latBigInt < 0n ? (latBigInt + this.FIELD_MODULUS) % this.FIELD_MODULUS : latBigInt;
        const adjustedLon = lonBigInt < 0n ? (lonBigInt + this.FIELD_MODULUS) % this.FIELD_MODULUS : lonBigInt;
      
        return {
          lat: `0x${adjustedLat.toString(16)}`,
          lon: `0x${adjustedLon.toString(16)}`,
        };
      };

    async getRelaySessionStatus(id: string): Promise<string> {
        const relaySession = await this.relaySessionRepository.findOne({ where: { id } });
        if (!relaySession) {
            throw new NotFoundException('Relay session not found');
        }
        return relaySession.value;
    }

    bigIntToHexString = (value: bigint): string => {
      const adjusted = value >= 0n ? value : (value + this.FIELD_MODULUS) % this.FIELD_MODULUS
      return `0x${adjusted.toString(16)}`
    }
    
    poseidonHash = async (minLat: string, maxLat: string, minLon: string, maxLon: string) => {
      const poseidon = await circomlib.buildPoseidon()
      const parseField = (x: string) => BigInt(x.startsWith("0x") ? x : `0x${x}`)
      return poseidon([
        parseField(minLat),
        parseField(maxLat),
        parseField(minLon),
        parseField(maxLon),
      ])
    }
    
    poseidonHash2 = async (a: bigint, b: bigint) => {
      const poseidon = await circomlib.buildPoseidon()
      return poseidon([a, b])
    }
    
    convertHashToHex = async (hash: unknown): Promise<string> => {
      const poseidon = await circomlib.buildPoseidon()
      return `0x${poseidon.F.toObject(hash).toString(16)}`
    }

    async getPublicInputsForBerlin() {
        // Convert coordinates to fixed-point notation (multiply by 1M to handle decimals)
        const minLat = BigInt(52310000); // 52.31
        const maxLat = BigInt(52680000); // 52.68
        const minLon = BigInt(13080000); // 13.08
        const maxLon = BigInt(13760000); // 13.76
    
        // No need for adjustment since all values are positive
        const minLatHex = this.bigIntToHexString(minLat);
        const maxLatHex = this.bigIntToHexString(maxLat);
        const minLonHex = this.bigIntToHexString(minLon);
        const maxLonHex = this.bigIntToHexString(maxLon);
    
        const regionHash = await this.poseidonHash(minLatHex, maxLatHex, minLonHex, maxLonHex);
        const regionHashHex = await this.convertHashToHex(regionHash);
    
        const challenge = BigInt(12345);
        const sessionHashRaw = await this.poseidonHash2(BigInt(regionHashHex), challenge);
        const sessionHashHex = await this.convertHashToHex(sessionHashRaw);
    
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
  
}
