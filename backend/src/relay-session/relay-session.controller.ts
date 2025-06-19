import { Controller, Get, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { RelaySessionService } from './relay-session.service';
import { UpdateRelaySessionDto } from './dto/updateRelaySession.dto';

@Controller('relay-session')
export class RelaySessionController {
  constructor(private readonly relaySessionService: RelaySessionService) {}


  @Get()
  async createRelaySession(): Promise<string> {
    const relaySession = await this.relaySessionService.createRelaySession();
    return relaySession.id;
  }

  @Get('status/:id')
  async getRelaySessionStatus(@Param('id') id: string): Promise<string> {
    return await this.relaySessionService.getRelaySessionStatus(id);
  }

  @Post(':id')
  async updateRelaySession(@Param('id') id: string, @Body() dto: UpdateRelaySessionDto) {
    if (!dto?.value) {
      throw new BadRequestException('Value is required');
    }
    return await this.relaySessionService.updateRelaySession(id, dto);
  }
}
