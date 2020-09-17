Try:

```sh
yarn ts-node index
# Change PORT
PORT=80 yarn ts-node index
# Invalid port:
PORT=-1 yarn ts-node index
# Set production and see it fail
NODE_ENV=production yarn ts-node index
# Fix errors
NODE_ENV=production PORT=80 MY_VAR="🚀" yarn ts-node index
```
