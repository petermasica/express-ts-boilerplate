import { HttpStatus } from 'http-status';
import { ZodIssue } from 'zod';

// Utility type to extract only number-valued keys
type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

// This will be a union of keys like 'BAD_REQUEST' | 'NOT_FOUND' | ...
type HttpStatusNumberKey = NumberKeys<HttpStatus>;

// This will be a union of all status code numbers, e.g., 400 | 404 | ...
type HttpStatusNumber = HttpStatus[HttpStatusNumberKey];

export class APIError extends Error {
  status: HttpStatusNumber;
  isPublic: boolean;
  validationErrors?: ZodIssue[];

  // Overload signatures
  constructor(
    message: string,
    status: 400,
    isPublic: boolean,
    validationErrors: ZodIssue[],
  );
  constructor(
    message: string,
    status: Exclude<HttpStatusNumber, 400>,
    isPublic?: boolean,
  );

  constructor(
    message: string,
    status: HttpStatusNumber,
    isPublic = false,
    validationErrors?: ZodIssue[],
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.isPublic = isPublic;
    this.validationErrors = validationErrors;
  }
}
