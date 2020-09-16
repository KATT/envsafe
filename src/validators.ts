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
