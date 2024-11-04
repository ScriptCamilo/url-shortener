import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UrlsService } from '../urls/urls.service';

@Injectable()
export class RedirectService {
  constructor(
    private urlsService: UrlsService,
    private configService: ConfigService,
  ) {}

  async findUrlByShortUrlId(shortUrlId: string) {
    const hostUrl = this.configService.get<string>('HOST_URL');
    const shortUrl = `${hostUrl}/${shortUrlId}`;

    const url = await this.urlsService.findOne({ shortUrl });

    await this.urlsService.incrementClick(url.id);

    return url;
  }
}
