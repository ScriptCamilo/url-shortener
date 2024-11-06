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
      const encryptedPassword = await this.encryptPassword(createUserDto.password);
      const { password: _, ...user } = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: encryptedPassword,
        },
      });
      const jwtObject = await this.authService.validateUser({
        email: user.email,
        password: createUserDto.password,
      });

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
      const encryptedPassword = await this.encryptPassword(updateUserDto.password);
      const user = await this.prismaService.user.update({
        omit: { password: true },
        where: { id },
        data: {
          ...updateUserDto,
          password: encryptedPassword,
        },
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

  async encryptPassword(password: string) {
    if (!password) return;

    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
}
