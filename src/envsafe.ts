import { InvalidEnvError, MissingEnvError } from './errors';
import { freezeObject } from './freezeObject';
import { defaultReporter } from './reporter';
import {
  EnvsafeOpts,
  Environment,
  Errors,
  ValidatorSpec,
  Validators,
} from './types';

function getValueOrThrow<TValue>({
  env,
  validator,
  key,
}: {
  env: Environment;
  validator: ValidatorSpec<TValue>;
  key: string;
}): TValue {
  const usingDevDefault = env.NODE_ENV !== 'production';
  const { allowEmpty = false } = validator;

  /**
   * Function to see if the value isn't empty or undefined
   */
  function isSet(value: string | TValue | undefined): value is string | TValue {
    if (!allowEmpty) {
      return value !== undefined && value !== '';
    }
    return value !== undefined;
  }

  let input: string | TValue | undefined = isSet(validator.input)
    ? validator.input
    : env[key];

  if (usingDevDefault && !isSet(input) && isSet(validator.devDefault)) {
    input = validator.devDefault;
  }
  if (!isSet(input) && isSet(validator.default)) {
    input = validator.default;
  }

  if (!isSet(input)) {
    let errMessage = `Missing value`;
    if (!validator.allowEmpty) {
      errMessage += ' or empty string';
    }
    throw new MissingEnvError(errMessage);
  }

  const output = validator._parse(input);

  if (validator.choices && !validator.choices.includes(output)) {
    throw new InvalidEnvError(
      `Value "${output}" not in choices [${validator.choices}]`,
    );
  }

  return output;
}

export function envsafe<TCleanEnv>(
  validators: Validators<TCleanEnv>,
  {
    reporter = defaultReporter,
    env = process.env,
    strict = false,
  }: EnvsafeOpts<TCleanEnv> = {},
): Readonly<TCleanEnv> {
  const errors: Errors = {};
  const output = {} as TCleanEnv;

  for (const key in validators) {
    const validator = validators[key];
    try {
      const resolved = getValueOrThrow({ env, validator, key });
      output[key] = resolved;
    } catch (err) {
      errors[key] = err;
    }
  }

  if (Object.keys(errors).length) {
    reporter({ errors, output, env });
  }

  return strict ? freezeObject(output, env) : output;
}
