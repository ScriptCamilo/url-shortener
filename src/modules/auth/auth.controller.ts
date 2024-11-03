import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthPayloadDto } from './dto/auth-payload.dto';
import { LocalGuard } from './guards/local.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Body() _authPayloadDto: AuthPayloadDto, @Req() req: Request) {
    const jwtObject = req.user as { access_token: string };

    return jwtObject;
  }
}
