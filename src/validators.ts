import { invalidEnvError } from './errors';
import { Spec, ValidatorSpec } from './types';
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // intentionally non-exhaustive

export function makeValidator<TValue>(
  parser: (input: string | TValue) => TValue,
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
      throw invalidEnvError('str', input);
  }
});

export const str = makeValidator<string>(input => {
  if (typeof input !== 'string') {
    throw invalidEnvError('str', input);
  }
  return input;
});

export const email = makeValidator<string>(input => {
  if (!EMAIL_REGEX.test(input)) {
    throw invalidEnvError('email', input);
  }
  return input;
});

export const num = makeValidator<number>(input => {
  const coerced = +input;
  if (Number.isNaN(coerced)) {
    throw invalidEnvError('num', input);
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
    throw invalidEnvError('port', input);
  }
  return coerced;
});

export const url = makeValidator<string>(input => {
  try {
    new URL(input); // validate url
    return input;
  } catch (_) {
    throw invalidEnvError('url', input);
  }
});

export const json = makeValidator<unknown>(input => {
  try {
    if (typeof input !== 'string') {
      return input;
    }

    return JSON.parse(input) as unknown;
  } catch (e) {
    throw invalidEnvError('json', input);
  }
});
