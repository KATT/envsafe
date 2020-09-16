import { cleanEnv, str } from "../../../";


const publicEnvVars = {
  NEXT_PUBLIC_ENV_VARIABLE: str({
    // because of how nextjs deals with transpiling public env vars 
    // we have to put it in as `default`
    input: process.env.NEXT_PUBLIC_ENV_VARIABLE,
  }),
};

export const publicEnv = cleanEnv(process.env, publicEnvVars)

