export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  public constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
