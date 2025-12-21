import "dotenv/config";
import { parseEnv } from "./validations/envValidations";

export const env = parseEnv(process.env);
