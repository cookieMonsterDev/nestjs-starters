import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class DatabaseExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message = exception.message;
    const target = exception.meta.target || [];

    switch (exception.code) {
      case 'P2025': // Not found error code
        response.status(HttpStatus.NOT_FOUND).json({
          message,
          error: "Not Found",
          statusCode: HttpStatus.NOT_FOUND,
        });
        break;

      case 'P2002': // Unique constraint error code
        response.status(HttpStatus.CONFLICT).json({
          message: `${target[0]} is taken`,
          error: "Conflict",
          statusCode: HttpStatus.CONFLICT,
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