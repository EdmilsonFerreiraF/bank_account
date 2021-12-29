import httpStatusCodes from './HttpStatusCode'

import { BaseError } from './BaseError'

export class NotFound extends BaseError {
    constructor(
        name: string,
        statusCode = httpStatusCodes.NOT_FOUND,
        description = 'Not found',
        isOperational = true
    ) {
        super(name, statusCode, description, isOperational)
    }
}