import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { UrlsModule } from '../urls/urls.module';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';

describe('RedirectController', () => {
  let controller: RedirectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UrlsModule, ConfigModule],
      controllers: [RedirectController],
      providers: [RedirectService],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
