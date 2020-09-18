const { envsafe, str, num } = require('envsafe');

const envValidators = {
  NEXT_PUBLIC_NO_DEFAULT: str(),
  NEXT_PUBLIC_WITH_DEFAULT: str({
    devDefault: 'with default',
    default: 'production default',
  }),
}

module.exports = {
  envValidators,
}
