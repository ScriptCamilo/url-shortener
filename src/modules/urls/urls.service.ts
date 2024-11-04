import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create({ longUrl }: CreateUrlDto, userId?: string) {
    const maxLength = 6;
    const minLength = 3;
    const urlIdLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const urlId = nanoid(urlIdLength);
    const hostUrl = this.configService.get<string>('HOST_URL');
    const shortUrl = `${hostUrl}/${urlId}`;

    await this.cacheManager.del(`urls-${userId}`);

    return this.prismaService.url.create({
      data: {
        longUrl,
        shortUrl,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    const cachedUrls = await this.cacheManager.get(`urls-${userId}`);

    if (cachedUrls) return cachedUrls;

    const urls = await this.prismaService.url.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    await this.cacheManager.set(`urls-${userId}`, urls);

    return urls;
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

      await this.cacheManager.del(`urls-${userId}`);

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
      const url = await this.prismaService.url.update({
        where: { id, userId, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      await this.cacheManager.del(`urls-${userId}`);

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
    const url = await this.prismaService.url.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    await this.cacheManager.del(`urls-${url.userId}`);

    return url;
  }
}
