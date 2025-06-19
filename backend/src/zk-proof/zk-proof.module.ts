import { Module } from '@nestjs/common';
import { ZkProofService } from './zk-proof.service';
import { ZkProofController } from './zk-proof.controller';

@Module({
  providers: [ZkProofService],
  controllers: [ZkProofController],
  exports: [ZkProofService],
})
export class ZkProofModule {}
