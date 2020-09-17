const { envsafe, str, num } = require('envsafe');

console.log('env', process.envsafe, process.my_env, process.env.meep, process.env.envsafe)

console.log('env', process.env)
const browserEnv = envsafe({
  NEXT_PUBLIC_NO_DEFAULT: str(),
  NEXT_PUBLIC_WITH_DEFAULT: str({
    devDefault: 'with default',
  }),
}, {
  // As we're using plain JS, it's useful to use strict mode which prevents accessing undefined props
  strict: true,
  env: process.envsafe,
})


module.exports = {
  browserEnv,
}