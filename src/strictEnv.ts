import { cleanEnv } from './cleanEnv';
import { CleanEnvOpts, Validators } from './types';

const inspectables = [
  'length',
  'inspect',
  'hasOwnProperty',
  'toJSON',

  // For libs that use `then` checks to see if objects are Promises
  // https://github.com/af/envalid/issues/74
  'then',
  // For usage with TypeScript esModuleInterop flag
  '__esModule',
];

export function strictEnv<TCleanEnv>(
  validators: Validators<TCleanEnv>,
  opts: CleanEnvOpts<TCleanEnv> = {},
): Readonly<TCleanEnv> {
  const env = opts.env ?? process.env;
  const envObj = cleanEnv(validators, { ...opts, env });
  return new Proxy(envObj, {
    get(_target, name) {
      // These checks are needed because calling console.log on a
      // proxy that throws crashes the entire process. This whitelists
      // the necessary properties for `console.log(envObj)`, `envObj.length`,
      // `envObj.hasOwnProperty('string')` to work.
      if (typeof name !== 'string' || inspectables.includes(name)) {
        return (envObj as any)[name];
      }

      const varExists = envObj.hasOwnProperty(name);
      if (!varExists) {
        if (env.hasOwnProperty(name)) {
          throw new ReferenceError(
            `[envsafe] Env var ${String(
              name,
            )} was accessed but not validated. This var is set in the environment; please add an envsafe validator for it.`,
          );
        }

        throw new ReferenceError(
          `[envsafe] Env var not found: ${String(name)}`,
        );
      }

      return (envObj as any)[name];
    },
  });
}
