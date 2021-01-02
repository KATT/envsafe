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
  treatEmptyAsNull,
}: {
  env: Environment;
  validator: ValidatorSpec<TValue>;
  key: string;
  treatEmptyAsNull: boolean;
}): TValue {
  let raw: string | TValue | undefined = validator.input ?? env[key];

  const usingDevDefault = env.NODE_ENV !== 'production';

  const canUse = (r: typeof raw): r is string | TValue => {
    let toReturn = r !== undefined;

    if (treatEmptyAsNull) {
      return toReturn && r !== '';
    }

    return toReturn;
  };

  if (!canUse(raw) && usingDevDefault && validator.devDefault !== undefined) {
    raw = validator.devDefault;
  }
  if (!canUse(raw) && validator.default !== undefined) {
    raw = validator.default;
  }
  if (!canUse(raw)) {
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
    treatEmptyAsNull = false,
  }: EnvsafeOpts<TCleanEnv> = {},
): Readonly<TCleanEnv> {
  const errors: Errors = {};
  const output = {} as TCleanEnv;

  for (const key in validators) {
    const validator = validators[key];
    try {
      const resolved = getValueOrThrow({
        env,
        validator,
        key,
        treatEmptyAsNull,
      });

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
