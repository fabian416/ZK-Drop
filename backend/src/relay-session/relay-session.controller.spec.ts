import { Test, TestingModule } from '@nestjs/testing';
import { RelaySessionController } from './relay-session.controller';
import { RelaySessionService } from './relay-session.service';

describe('RelaySessionController', () => {
  let controller: RelaySessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelaySessionController],
      providers: [RelaySessionService],
    }).compile();

    controller = module.get<RelaySessionController>(RelaySessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
