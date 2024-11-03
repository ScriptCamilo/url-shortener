import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';

import { PrismaService } from '@/database/prisma.service';
import { AuthService } from '@/modules/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const encryptedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
      const { password, ...user } = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: encryptedPassword,
        },
      });

      const jwtObject = await this.authService.validateUser({ email: user.email, password });

      return { ...jwtObject, ...user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new ConflictException('Email is already registered');
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        omit: { password: true },
        where: { id },
      });

      if (!user) throw new NotFoundException();

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User Not Found');
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({
        omit: { password: true },
        where: { id },
        data: updateUserDto,
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new NotFoundException('User Not Found');
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prismaService.user.delete({
        omit: { password: true },
        where: { id },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(error.message);
        throw new NotFoundException('User Not Found');
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
