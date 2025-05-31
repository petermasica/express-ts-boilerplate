declare namespace Express {
  interface Request {
    validatedParams?: unknown;
    validatedBody?: unknown;
    validatedQuery?: unknown;
  }
}
