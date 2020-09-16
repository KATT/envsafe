export class EnvError extends TypeError {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, EnvError.prototype);
  }
}

export class EnvMissingError extends ReferenceError {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, EnvMissingError.prototype);
  }
}
