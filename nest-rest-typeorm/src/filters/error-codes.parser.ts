import { HttpStatus } from '@nestjs/common';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

interface ErrorResponse {
  statusCode: HttpStatus | number;
  message: string;
  error?: string;
}

const typeORMErrorCodesParser = (exception: any): ErrorResponse => {
  if (exception instanceof EntityNotFoundError) {
    const entityRegex = RegExp(
      /Could not find any entity of type "([\s\S]*?)" matching:/,
    );
    const entityName = exception.message.match(entityRegex)[1];
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: `${entityName} not found`,
    };
  }

  if (exception instanceof QueryFailedError) {
    const errorCode = exception.driverError.errno;

    switch (errorCode) {
      case 1062: {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Duplicate entry',
          error: exception.message,
        };
      }
      default: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database query failed.',
        };
      }
    }
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Tnternal server error',
  };
};

export default typeORMErrorCodesParser;