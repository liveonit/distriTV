import { ErrorCode, ErrorName } from './types';
import { BaseError } from '../BaseClasses/BaseError';

export class NotFound extends BaseError {
  constructor(message = 'Resource not found') {
    super({ name: ErrorName.NOT_FOUND, message, code: ErrorCode.NOT_FOUND });
  }
}
