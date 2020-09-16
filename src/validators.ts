import { Spec, ValidatorSpec } from './types';

export class EnvError extends TypeError {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, EnvMissingError);
    this.name = 'EnvMissingError';
  }
}

export class EnvMissingError extends ReferenceError {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, EnvMissingError);
    this.name = 'EnvMissingError';
  }
}

export function makeValidator<TValue>(
  parser: (input: string) => TValue | EnvError
): (spec?: Spec<TValue>) => ValidatorSpec<TValue> {
  return (spec = {}) => {
    return {
      ...spec,
      _parse: parser,
    };
  };
}

export const str = makeValidator<string>(input => {
  return input;
});

export const num = makeValidator<number>(input => {
  const coerced = +input;
  if (Number.isNaN(coerced)) {
    return new EnvError(`Invalid number input: "${input}"`);
  }
  return coerced;
});
