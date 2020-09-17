import { InvalidEnvError, MissingEnvError } from './errors';
import { defaultReporter } from './reporter';
import {
  CleanEnvOpts,
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

  let raw: string | TValue | undefined = env[key];

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

export function cleanEnv<TCleanEnv>(
  env: Environment,
  validators: Validators<TCleanEnv>,
  { reporter = defaultReporter }: CleanEnvOpts<TCleanEnv> = {},
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

  return Object.freeze ? Object.freeze(output) : output;
}
