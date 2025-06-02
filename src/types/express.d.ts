declare namespace Express {
  interface Request {
    validated: {
      params: unknown;
      body: unknown;
      query: unknown;
    };
  }
}
