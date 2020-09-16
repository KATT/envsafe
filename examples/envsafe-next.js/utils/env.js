import { cleanEnv, str } from "envsafe";


export const env = cleanEnv(process.env, {
  NEXT_PUBLIC_ENV_VARIABLE: str(),
})