export class EnvError extends TypeError {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, EnvError.prototype);
  }
}

export const invalidEnvError = (type: string, input: unknown) =>
  new EnvError(`Invalid ${type} input: "${input}"`);

export class EnvMissingError extends ReferenceError {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, EnvMissingError.prototype);
  }
}
