const { envsafe, str, num } = require('envsafe');

const browserEnv = envsafe({
  NEXT_PUBLIC_NO_DEFAULT: str(),
  NEXT_PUBLIC_WITH_DEFAULT: str({
    devDefault: 'with default',
    default: 'production default',
  }),
}, {
  strict: true,
  env: process.browserEnv,
})

module.exports = {
  browserEnv,
}
