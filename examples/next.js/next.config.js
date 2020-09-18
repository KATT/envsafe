const { envValidators } = require('./utils/envValidators')
const { nextjsWebpackPlugin } = require('envsafe')

module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(nextjsWebpackPlugin({
      validators: envValidators,
      webpack
    }))

    return config
  },
}
