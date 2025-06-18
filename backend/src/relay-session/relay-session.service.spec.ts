import { Test, TestingModule } from '@nestjs/testing';
import { RelaySessionService } from './relay-session.service';

describe('RelaySessionService', () => {
  let service: RelaySessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelaySessionService],
    }).compile();

    service = module.get<RelaySessionService>(RelaySessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
