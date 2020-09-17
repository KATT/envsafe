const { browserEnv } = require('./utils/browserEnv')
const { nextjsWebpackPlugin } = require('envsafe')

module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(nextjsWebpackPlugin({ browserEnv, webpack }))

    return config
  },
}
