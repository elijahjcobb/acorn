export class APIError {
  public readonly code: number;
  public readonly message: string;
  public readonly error: Error | undefined;

  public constructor(code: number, message: string, error?: Error) {
    this.code = code;
    this.message = message;
    this.error = error;
  }
}
