import { cleanEnv, str } from "envsafe";
import { publicEnv } from "./publicEnv";

export const serverEnv = {
  ...publicEnv,
  ...cleanEnv(process.env, {
    ENV_VARIABLE: str({
      default: process.env.ENV_VARIABLE,
    })
  })
}