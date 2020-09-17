import { cleanEnv, port, str } from '../../';

const env = cleanEnv({
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
  }),
  MY_VAR: str({
    devDefault: 'default value'
  }),
  PORT: port({
    devDefault: 3000,
  }),
});


console.log('PORT', env.PORT);

console.log('\n')

console.log('All environment variables:')
console.table(env);
