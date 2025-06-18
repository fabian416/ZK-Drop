import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RelaySessionService } from './relay-session.service';

@Controller('relay-session')
export class RelaySessionController {
  constructor(private readonly relaySessionService: RelaySessionService) {}


  @Get()
  async createRelaySession(): Promise<string> {
    const relaySession = await this.relaySessionService.createRelaySession();
    return relaySession.id;
  }

  @Post(':id')
  async updateRelaySession(@Param('id') id: string, @Body() dto: { value: string }) {
    return await this.relaySessionService.updateRelaySession(id, dto);
  }
}
