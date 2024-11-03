import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { PrismaService } from '@/database/prisma.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!foundUser) return null;

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

    if (isPasswordCorrect) {
      const { id } = foundUser;
      return {
        access_token: this.jwtService.sign(
          { id },
          {
            algorithm: 'HS256',
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '30d',
          },
        ),
      };
    }
  }
}
