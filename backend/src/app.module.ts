import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZkProofModule } from './zk-proof/zk-proof.module';
import { RelaySessionModule } from './relay-session/relay-session.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ZkProofModule,
    RelaySessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
