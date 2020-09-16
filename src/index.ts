import { EnvMissingError } from './errors';
import { defaultReporter } from './reporter';
import { CleanEnvOpts, Environment, Errors, ValidatorSpec } from './types';

type Validators<TCleanEnv> = {
  [K in keyof TCleanEnv]: ValidatorSpec<TCleanEnv[K]>;
};

function getValueOrError<TValue>({
  env,
  validator,
  key,
}: {
  env: Environment;
  validator: ValidatorSpec<TValue>;
  key: string;
}): TValue | Error {
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
    return new EnvMissingError(`Missing value for ${key}`);
  }

  return validator._parse(raw);
}

export function cleanEnv<TCleanEnv>(
  env: Environment,
  validators: Validators<TCleanEnv>,
  { reporter = defaultReporter }: CleanEnvOpts<TCleanEnv> = {}
): Readonly<TCleanEnv> {
  const errors: Errors = {};
  const output = {} as TCleanEnv;

  for (const key in validators) {
    const validator = validators[key];
    const resolved = getValueOrError({ env, validator, key });

    if (resolved instanceof Error) {
      errors[key] = resolved;
    } else {
      output[key] = resolved;
    }
  }

  if (Object.keys(errors).length) {
    reporter({ errors, output, env });
  }

  return Object.freeze ? Object.freeze(output) : output;
}
