export class InvalidEnvError extends TypeError {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidEnvError.prototype);
  }
}

export const invalidEnvError = (type: string, input: unknown) =>
  new InvalidEnvError(`Invalid ${type} input: "${input}"`);

export class EnvMissingError extends ReferenceError {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, EnvMissingError.prototype);
  }
}
