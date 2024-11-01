import { Test, TestingModule } from '@nestjs/testing';

import { EnvConfigModule } from '../../env-config.module';
import { EnvConfigService } from '../../env-config.service';

describe('EnvConfigService Unit Tests', () => {
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return the PORT variable', () => {
    expect(sut.getAppPort()).toBe(8080);
  });

  it('should return the NODE_ENV variable', () => {
    expect(sut.getNodeEnv()).toBe('test');
  });
});
