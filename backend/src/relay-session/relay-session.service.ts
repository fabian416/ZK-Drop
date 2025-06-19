import { Injectable, NotFoundException } from '@nestjs/common';
import { RelaySession } from './entities/relay-session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateRelaySessionDto } from './dto/updateRelaySession.dto';

@Injectable()
export class RelaySessionService {

    constructor(
        @InjectRepository(RelaySession)
        private relaySessionRepository: Repository<RelaySession>,
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
        relaySession.value = dto.value;
        return await this.relaySessionRepository.save(relaySession);
    }

    async getRelaySessionStatus(id: string): Promise<string> {
        const relaySession = await this.relaySessionRepository.findOne({ where: { id } });
        if (!relaySession) {
            throw new NotFoundException('Relay session not found');
        }
        return relaySession.value;
    }
}
