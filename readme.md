# Express TypeScript Boilerplate

## Tooling We Use

This project uses a modern TypeScript/Node.js stack with the following tools:

- **TypeScript**: Static typing for safer, more maintainable code.
- **Vitest**: Fast unit testing framework.
- **ESLint**: Linting for code quality and consistency.
- **Prettier**: Code formatting, with import sorting via `@trivago/prettier-plugin-sort-imports`.
- **Tsup**: Fast bundler for building the project.
- **TSX**: For running and watching TypeScript files in development.
- **Supertest**: HTTP assertions for integration testing of Express endpoints.
- **Husky & lint-staged**: Git hooks for enforcing code quality before commits.
- **Zod**: Runtime schema validation and OpenAPI integration.
- **Swagger UI Express**: API documentation.
- **Express**: Web framework.
- **MongoDB**: Database driver.

### Key NPM Scripts

- `build`: Type checks and builds the project.
- `typecheck`: Runs TypeScript compiler for type checking.
- `test`, `test:watch`, `test:coverage`: Run tests in different modes.
- `lint`, `format`: Lint and format codebase.
- `start`, `start:watch`: Start the server in production or development mode.

---

## Feature-Based Folder Structure & Avoiding Circular Dependencies

### Feature-Based Structure

We organize code by **feature**, not by type. Each feature (e.g., `products`, `users`) has its own folder containing:

- **Routes** (e.g., `products.routes.ts`)
- **Handlers/Controllers** (e.g., `products.handler.ts`)
- **Schemas** (e.g., `products.schema.ts`)
- **Tests** (e.g., `products.test.ts`)
- **Other logic** specific to that feature

This structure keeps related files together, making the codebase easier to navigate and scale.

**Example:**

```
src/
  api/
    products/
      products.routes.ts
      products.handler.ts
      products.schema.ts
      products.test.ts
    users/
      users.routes.ts
      users.handler.ts
      users.schema.ts
      users.test.ts
  config/
  error/
  middleware/
  openapi/
  shared/
    schemas/
    middleware/
  types/
```

### Avoiding Circular Dependencies

To prevent circular dependencies:

- **Shared code** is placed in `src/shared`.
  - **Common repositories**: Database access logic or base repository functions used by multiple features
  - **Schemas**: Zod schemas reused by multiple features
  - **Utils**: General-purpose functions
- **Feature modules** only import from:
  - Their own files
  - Shared/common files
- **No cross-feature imports**: Features do not import from each other directly.
- **Absolute imports** (using path aliases) help clarify dependencies.

This approach ensures a clear, acyclic dependency graph, making the codebase robust and maintainable.
