import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    return createdUser;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@Req() req: Request) {
    const jwtUser = req.user as { id: string };
    const foundUser = await this.usersService.findOne(jwtUser.id);

    return foundUser;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const jwtUser = req.user as { id: string };
    const updatedUser = await this.usersService.update(jwtUser.id, updateUserDto);

    return updatedUser;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Req() req: Request) {
    const jwtUser = req.user as { id: string };
    const deletedUser = await this.usersService.remove(jwtUser.id);

    return deletedUser;
  }
}
