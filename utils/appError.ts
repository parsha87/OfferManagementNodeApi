export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errors: string[];

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // This we have added as there will be other types of errors that will also be raised by our application.
    // These might be more linked to programming errors. So the below flag will help us check that.
    this.isOperational = true;

    // This will capture the current stack trace, minus the current constructor function invocation.
    Error.captureStackTrace(this, this.constructor);
  }
}
