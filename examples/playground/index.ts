import { envsafe, port, str, url } from '../../';

const env = envsafe({
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    devDefault: 'development'
  }),
  MY_VAR: str({
    devDefault: 'default value'
  }),
  API_URL: url({
    devDefault: "http://example.com/graphql"
  }),
  PORT: port({
    devDefault: 3000,
  }),
});


console.log('PORT', env.PORT);

console.log('\n')

console.log('All environment variables:')
console.table(env);
