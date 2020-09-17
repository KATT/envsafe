Try:

```sh
yarn dev
# Change PORT
PORT=80 yarn dev
# Invalid port:
PORT=-1 yarn dev
# Set production and see it fail
NODE_ENV=production yarn dev
# Fix errors
NODE_ENV=production PORT=80 MY_VAR="🚀" yarn dev
```
