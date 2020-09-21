import { InvalidEnvError, MissingEnvError } from './errors';
import { freezeObject } from './freezeObject';
import { defaultReporter } from './reporter';
import {
  EnvsafeOpts,
  Environment,
  Errors,
  ValidatorSpec,
  Validators,
  KeyValidator,
} from './types';

function getValueOrThrow<TValue>({
  env,
  validator,
  key,
  validateKey,
}: {
  env: Environment;
  validator: ValidatorSpec<TValue>;
  key: string;
  validateKey?: KeyValidator;
}): TValue {
  const usingDevDefault = env.NODE_ENV !== 'production';

  let raw: string | TValue | undefined = validator.input ?? env[key];

  if (validateKey && !validateKey(key)) {
    throw new InvalidEnvError(`Invalid environment key "${key}"`);
  }

  if (
    raw === undefined &&
    usingDevDefault &&
    validator.devDefault !== undefined
  ) {
    raw = validator.devDefault;
  }
  if (raw === undefined && validator.default !== undefined) {
    raw = validator.default;
  }
  if (raw === undefined) {
    throw new MissingEnvError(`Missing value`);
  }

  const value = validator._parse(raw);

  if (validator.choices && !validator.choices.includes(value)) {
    throw new InvalidEnvError(
      `Value "${value}" not in choices [${validator.choices}]`,
    );
  }

  return value;
}

export function envsafe<TCleanEnv>(
  validators: Validators<TCleanEnv>,
  {
    reporter = defaultReporter,
    env = process.env,
    strict = false,
    validateKey,
  }: EnvsafeOpts<TCleanEnv> = {},
): Readonly<TCleanEnv> {
  const errors: Errors = {};
  const output = {} as TCleanEnv;

  for (const key in validators) {
    const validator = validators[key];
    try {
      const resolved = getValueOrThrow({ env, validator, key, validateKey });
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
