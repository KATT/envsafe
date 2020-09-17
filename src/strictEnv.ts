import { cleanEnv } from './cleanEnv';
import { CleanEnvOpts, Validators } from './types';

const inspectables = [
  'length',
  'inspect',
  'hasOwnProperty',
  'toJSON',
  Symbol.toStringTag,
  Symbol.iterator,

  // For libs that use `then` checks to see if objects are Promises (see #74):
  'then',
  // For usage with TypeScript esModuleInterop flag
  '__esModule',
];
const inspectSymbolStrings = [
  'Symbol(util.inspect.custom)',
  'Symbol(nodejs.util.inspect.custom)',
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
      if (
        inspectables.includes(name as any) ||
        inspectSymbolStrings.includes(name.toString())
      ) {
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
