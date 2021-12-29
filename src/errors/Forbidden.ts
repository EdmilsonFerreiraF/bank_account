import httpStatusCodes from './HttpStatusCode'

import { BaseError } from './BaseError'

export class Forbidden extends BaseError {
    constructor(
        name: string,
        statusCode = httpStatusCodes.FORBIDDEN,
        description = 'Not permitted',
        isOperational = true
    ) {
        super(name, statusCode, description, isOperational)
    }
}