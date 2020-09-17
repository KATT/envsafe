import { DefinePlugin } from 'webpack';

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
  const env = {} as TCleanEnv;
  for (const key in browserEnv) {
    if (key.startsWith('NEXT_PUBLIC_')) {
      env[key] = browserEnv[key];
    }
  }

  return new webpack.DefinePlugin({
    'process.browserEnv': JSON.stringify(env),
  });
}
