import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZkProofModule } from './zk-proof/zk-proof.module';

@Module({
  imports: [ZkProofModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
