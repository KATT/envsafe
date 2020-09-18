import { DefinePlugin } from 'webpack';
import { envsafe } from '../envsafe';
import { InvalidEnvError } from '../errors';
import { Validators } from '../types';

export function nextjsWebpackPlugin<TCleanEnv>(
  validators: Validators<TCleanEnv>,
  webpack: {
    DefinePlugin: typeof DefinePlugin;
  },
  env = process.env,
) {
  const cleanEnv = envsafe(validators, {
    validateKey(key) {
      if (!key.startsWith('NEXT_PUBLIC_')) {
        throw new InvalidEnvError(`Not prefixed with "NEXT_PUBLIC_"`);
      }
      return true;
    },
    env,
  });
  return new webpack.DefinePlugin({
    'process.envsafe': JSON.stringify(cleanEnv),
  });
}
