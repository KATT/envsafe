import { EnvError } from './errors';
import { Spec, ValidatorSpec } from './types';

export function makeValidator<TValue>(
  parser: (input: string | TValue) => TValue
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
    throw new EnvError(`Invalid string input: "${input}"`);
  }
  return input;
});

export const num = makeValidator<number>(input => {
  const coerced = +input;
  if (Number.isNaN(coerced)) {
    throw new EnvError(`Invalid number input: "${input}"`);
  }
  return coerced;
});

export const port = makeValidator<number>(input => {
  const coerced = +input;
  if (
    Number.isNaN(coerced) ||
    `${coerced}` !== `${input}` ||
    coerced % 1 !== 0 ||
    coerced < 1 ||
    coerced > 65535
  ) {
    throw new EnvError(`Invalid port input: "${input}"`);
  }
  return coerced;
});

export const url = makeValidator<URL>(input => {
  try {
    if (input instanceof URL) {
      return input;
    }
    return new URL(input);
  } catch (_) {
    throw new EnvError(`Invalid url: "${input}"`);
  }
});
