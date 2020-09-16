import { Spec, ValidatorSpec } from './types';

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

export function makeValidator<TValue>(
  parser: (input: string | TValue) => TValue | EnvError
): (spec?: Spec<TValue>) => ValidatorSpec<TValue> {
  return (spec = {}) => {
    return {
      ...spec,
      _parse: parser,
    };
  };
}

export const str = makeValidator<string>(input => {
  if (typeof input !== 'string') {
    return new EnvError(`Invalid string input: "${input}"`);
  }
  return input;
});

export const num = makeValidator<number>(input => {
  const coerced = +input;
  if (Number.isNaN(coerced)) {
    return new EnvError(`Invalid number input: "${input}"`);
  }
  return coerced;
});

