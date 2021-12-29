import httpStatusCodes from './HttpStatusCode'

export class BaseError extends Error {
   public readonly name: string;
   public readonly httpCode: httpStatusCodes;
   public readonly isOperational: boolean;
   
   constructor(name: string, httpCode: httpStatusCodes, description: string, isOperational: boolean) {
     super(description);
     Object.setPrototypeOf(this, new.target.prototype);
   
     this.name = name;
     this.httpCode = httpCode;
     this.isOperational = isOperational;
   
     Error.captureStackTrace(this);
   }
  }
