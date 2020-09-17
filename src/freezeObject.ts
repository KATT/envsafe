import { Environment } from './types';

const inspectables = [
  'length',
  'inspect',
  'hasOwnProperty',
  'toJSON',

  // jest stuff:
  'asymmetricMatch',
  'nodeType',
  '$$typeof',
  'constructor',
  '@@__IMMUTABLE_ITERABLE__@@',
  '@@__IMMUTABLE_RECORD__@@',
  '_isMockFunction',

  // For libs that use `then` checks to see if objects are Promises
  // https://github.com/af/envalid/issues/74
  'then',
  // For usage with TypeScript esModuleInterop flag
  '__esModule',
];

export function freezeObject<TCleanEnv extends Record<string, any>>(
  envObj: TCleanEnv,
  env: Environment,
): Readonly<TCleanEnv> {
  const frozen = Object.freeze ? Object.freeze(envObj) : envObj;

  return global.Proxy
    ? new Proxy(frozen, {
        get(_target, name) {
          // These checks are needed because calling console.log on a
          // proxy that throws crashes the entire process. This whitelists
          // the necessary properties for `console.log(frozen)`, `frozen.length`,
          // `frozen.hasOwnProperty('string')` to work.

          if (typeof name !== 'string' || inspectables.includes(name)) {
            return (frozen as any)[name];
          }

          const varExists = frozen.hasOwnProperty(name);
          if (!varExists) {
            if (env.hasOwnProperty(name)) {
              throw new ReferenceError(
                `[envsafe] Env var ${String(
                  name,
                )} was accessed but not validated. This var is set in the environment; please add an envsafe validator for it.`,
              );
            }

            throw new ReferenceError(
              `[envsafe] Env var "${String(name)}" not found`,
            );
          }

          return (frozen as any)[name];
        },
      })
    : frozen;
}
