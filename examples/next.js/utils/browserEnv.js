import { envsafe, str } from '../../../';


export const browserEnv = envsafe({
  NEXT_PUBLIC_NO_DEFAULT: str({
    // because of how nextjs deals with transpiling public env vars 
    // we have to put it in as `input`
    input: process.env.NEXT_PUBLIC_NO_DEFAULT,
  }),
  NEXT_PUBLIC_WITH_DEFAULT: str({
    default: 'with default',
    input: process.env.NEXT_PUBLIC_WITH_DEFAULT,
  }),
}, {
  // As we're using plain JS, it's useful to use strict mode which prevents accessing undefined props
  strict: true
})

