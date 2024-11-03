import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

import { AuthPayloadDto } from '../dto/auth-payload.dto';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const body = plainToClass(AuthPayloadDto, request.body);

    validate(body).then((errors) => {
      const errorMessages = errors.flatMap(({ constraints }) => Object.values(constraints));
      if (errorMessages.length > 0) {
        response.status(HttpStatus.BAD_REQUEST).send({
          message: errorMessages,
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    });

    return super.canActivate(context);
  }
}
