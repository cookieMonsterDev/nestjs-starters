import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import typeORMErrorCodesParser from './error-codes.parser';

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const error = typeORMErrorCodesParser(exception);

    response.status(error.statusCode).json({
      ...error,
    });
  }
}