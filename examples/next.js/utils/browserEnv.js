const { envsafe } = require('envsafe');
const { envValidators } = require('./envValidators');

const browserEnv = envsafe(envValidators, {
  strict: true,
  env: process.browserEnv,
})

module.exports = {
  browserEnv,
}
