import { Module } from '@nestjs/common';
import { RelaySessionService } from './relay-session.service';
import { RelaySessionController } from './relay-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelaySession } from './entities/relay-session.entity';
import { ZkProofModule } from 'src/zk-proof/zk-proof.module';

@Module({
  imports: [TypeOrmModule.forFeature([RelaySession]), ZkProofModule],
  controllers: [RelaySessionController],
  providers: [RelaySessionService],
  exports: [RelaySessionService],
})
export class RelaySessionModule {}
