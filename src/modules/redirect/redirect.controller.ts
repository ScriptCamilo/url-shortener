import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':shortUrlId')
  async redirect(@Res() res: Response, @Param('shortUrlId') shortUrlId: string) {
    const url = await this.redirectService.findUrlByShortUrlId(shortUrlId);
    return res.status(HttpStatus.PERMANENT_REDIRECT).redirect(url.longUrl);
  }
}
