import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { nanoid } from 'nanoid';

import { PrismaService } from '@/database/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { FindUrlDto } from './dto/find-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlsService {
  private readonly logger = new Logger(UrlsService.name);

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  create({ longUrl }: CreateUrlDto, userId?: string) {
    const maxLength = 6;
    const minLength = 3;
    const urlIdLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const urlId = nanoid(urlIdLength);
    const hostUrl = this.configService.get<string>('HOST_URL');
    const shortUrl = `${hostUrl}/${urlId}`;

    return this.prismaService.url.create({
      data: {
        longUrl,
        shortUrl,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.url.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  async findOne(args: FindUrlDto) {
    const url = await this.prismaService.url.findUnique({
      where: {
        id: args?.id,
        shortUrl: args?.shortUrl,
        userId: args?.userId,
        deletedAt: null,
      },
    });

    if (!url) throw new NotFoundException('Url Not Found');

    return url;
  }

  async update(id: string, updateUserDto: UpdateUrlDto, userId: string) {
    try {
      const url = await this.prismaService.url.update({
        where: { id, userId, deletedAt: null },
        data: updateUserDto,
      });

      return url;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new NotFoundException('Url Not Found');
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, userId: string) {
    try {
      console.log({ userId });
      const url = await this.prismaService.url.update({
        where: { id, userId, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      return url;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new NotFoundException('Url Not found');
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async incrementClick(id: string) {
    return this.prismaService.url.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  }
}
