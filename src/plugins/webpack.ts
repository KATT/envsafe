import { DefinePlugin } from 'webpack';
import { InvalidEnvError } from '../errors';
import { Errors } from '../types';

function validateKeysStartsWith<T extends Readonly<Record<string, any>>>(
  prefix: string,
  env: T,
) {
  const errors: Errors = {};
  for (const key in env) {
    if (!key.startsWith(prefix)) {
      errors[key] = new InvalidEnvError(
        `Needs to be prefixed with "${prefix}"`,
      );
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new TypeError('Invalid'); // todo use reporter
  }

  return env;
}

export function nextjsWebpackPlugin<
  TCleanEnv extends Readonly<Record<string, any>>
>({
  browserEnv,
  webpack,
}: {
  browserEnv: TCleanEnv;
  webpack: {
    DefinePlugin: typeof DefinePlugin;
  };
}) {
  validateKeysStartsWith('NEXT_PUBLIC_', browserEnv);

  return new webpack.DefinePlugin({
    'process.browserEnv': JSON.stringify(browserEnv),
  });
}

export function craWebpackPlugin<
  TCleanEnv extends Readonly<Record<string, any>>
>({
  browserEnv,
  webpack,
}: {
  browserEnv: TCleanEnv;
  webpack: {
    DefinePlugin: typeof DefinePlugin;
  };
}) {
  validateKeysStartsWith('REACT_APP_', browserEnv);

  return new webpack.DefinePlugin({
    'process.browserEnv': JSON.stringify(browserEnv),
  });
}
