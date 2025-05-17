import { Controller, Post, Body } from '@nestjs/common';
import { GenerateProofDto } from './dto/generate-zk-proof.dto';
import { ZkProofService } from './zk-proof.service';

@Controller('zk-proof')
export class ZkProofController {
  constructor(private readonly zkService: ZkProofService) {}

  @Post('generate-proof')
  async generate(@Body() dto: GenerateProofDto) {
    return await this.zkService.generateProof(dto);
  }
}
