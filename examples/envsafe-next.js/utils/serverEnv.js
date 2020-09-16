import { cleanEnv, str } from '../../../'
import { publicEnv } from "./publicEnv";

export const serverEnv = {
  ...publicEnv,
  ...cleanEnv(process.env, {
    ENV_VARIABLE: str({
    })
  })
}