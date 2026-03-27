export class BaseError extends Error {
  statusCode: number;
  constructor(message: any) {
    super(message);
    this.name = "BaseError";
    this.statusCode = 500;
  }
}

export class AuthError extends Error {
  statusCode: number;
  constructor(message: any) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 400;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: any) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: any) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  statusCode: number;
  constructor(message: any, errors: any) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export class ValidationError extends Error {
  statusCode: number;
  details: any;
  constructor(message: any, errors: any) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.details = this.parseValidationError(errors);
  }

  private parseValidationError(errors: any) {
    const errBag: any = [];

    errors?.issues.forEach((error: { path: any[] }) => {
      errBag.push({
        ...error,
        path: error.path[0],
      });
    });

    return errBag;
  }
}
