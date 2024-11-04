import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { UrlsModule } from '../urls/urls.module';
import { RedirectService } from './redirect.service';

describe('RedirectService', () => {
  let service: RedirectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UrlsModule, ConfigModule, CacheModule.register({ isGlobal: true })],
      providers: [RedirectService],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
