import { envsafe, str } from '../../../'
import { publicEnv } from "./publicEnv";

if (process.browser) {
  throw new Error('This should only be incldued on the client (but the env vars wont be exposed)')
}

export const serverEnv = {
  ...publicEnv,
  ...envsafe(process.env, {
    ENV_VARIABLE: str({
    })
  })
}