import { cleanEnv, str } from "../../../";


const publicEnvVars = {
  NEXT_PUBLIC_ENV_VARIABLE: str({
    default: process.env.NEXT_PUBLIC_ENV_VARIABLE,
  }),
};

export const publicEnv = cleanEnv(process.env, publicEnvVars)

