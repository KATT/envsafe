import { cleanEnv, str } from "envsafe";


export const publicEnvVars = {
  NEXT_PUBLIC_ENV_VARIABLE: str({
    default: process.env.NEXT_PUBLIC_ENV_VARIABLE,
  }),
};

export const publicEnv = cleanEnv(process.env, publicEnvVars)

