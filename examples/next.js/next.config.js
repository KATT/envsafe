const { browserEnv } = require('./utils/browserEnv')

console.log('browserenv', browserEnv)

function getEnvsafe() {
  const env = {}
  for (const key in browserEnv) {
    if (key.startsWith('NEXT_PUBLIC_')) {
      env[key] = browserEnv[key]
    }
  }
  return env;
}

module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.DefinePlugin({
      'process.envsafe': JSON.stringify(getEnvsafe()),
    }))

    return config
  },
}