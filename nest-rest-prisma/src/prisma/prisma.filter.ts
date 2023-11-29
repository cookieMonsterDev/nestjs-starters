import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2002': // Unique constraint error
        const t = exception.meta.target as string;
        const field = t.match(/_(.*?)_key/)[1];
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `${field} is taken.`,
          error: 'Conflict',
        });
        break;
      default:
        super.catch(
          new HttpException(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
          host,
        );
        break;
    }
  }
}