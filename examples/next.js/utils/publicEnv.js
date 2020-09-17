import { envsafe, str } from "../../../";


export const publicEnv = envsafe({
  NEXT_PUBLIC_NO_DEFAULT: str({
    // because of how nextjs deals with transpiling public env vars 
    // we have to put it in as `input`
    input: process.env.NEXT_PUBLIC_NO_DEFAULT,
  }),
  NEXT_PUBLIC_WITH_DEFAULT: str({
    devDefault: 'with default',
    input: process.env.NEXT_PUBLIC_WITH_DEFAULT,
  }),
})

