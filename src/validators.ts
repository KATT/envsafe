import { EnvError } from './errors';
import { Spec, ValidatorSpec } from './types';
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // intentionally non-exhaustive

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

export const bool = makeValidator<boolean>(input => {
  switch (input) {
    case true:
    case 'true':
    case 't':
    case '1':
      return true;
    case false:
    case 'false':
    case 'f':
    case '0':
      return false;
    default:
      throw new EnvError(`Invalid boolean input: "${input}"`);
  }
});

export const str = makeValidator<string>(input => {
  if (typeof input !== 'string') {
    throw new EnvError(`Invalid string input: "${input}"`);
  }
  return input;
});

export const email = makeValidator<string>(input => {
  if (!EMAIL_REGEX.test(input)) {
    throw new EnvError(`Invalid email address: "${input}"`);
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

export const json = makeValidator<unknown>(input => {
  try {
    if (typeof input !== 'string') {
      console.log('parsing not a string', input);
      return input;
    }

    return JSON.parse(input) as unknown;
  } catch (e) {
    throw new EnvError(`Invalid json: "${input}"`);
  }
});
