type Env = {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  JWT_SECRET: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_UNAME: string;
  DB_PASS: string;
  DB_NAME: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
};

export function parseEnv(env: NodeJS.ProcessEnv): Env {
  const {
    NODE_ENV,
    PORT,
    JWT_SECRET,
    DB_HOST,
    DB_PORT,
    DB_UNAME,
    DB_PASS,
    DB_NAME,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
  } = env;

  if (!NODE_ENV) throw new Error("Missing NODE_ENV");
  if (!PORT) throw new Error("Missing PORT");
  if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");
  if (!DB_HOST) throw new Error("Missing DB_HOST");
  if (!DB_PORT) throw new Error("Missing DB_PORT");
  if (!DB_UNAME) throw new Error("Missing DB_UNAME");
  if (!DB_PASS) throw new Error("Missing DB_PASS");
  if (!DB_NAME) throw new Error("Missing DB_NAME");
  if (!SMTP_HOST) throw new Error("Missing SMTP_HOST");
  if (!SMTP_PORT) throw new Error("Missing SMTP_PORT");
  if (!SMTP_USER) throw new Error("Missing SMTP_USER");
  if (!SMTP_PASS) throw new Error("Missing SMTP_PASS");

  return {
    NODE_ENV: NODE_ENV as Env["NODE_ENV"],
    PORT: Number(PORT),
    JWT_SECRET,
    DB_HOST,
    DB_PORT: Number(DB_PORT),
    DB_UNAME,
    DB_PASS,
    DB_NAME,
    SMTP_HOST,
    SMTP_PORT: Number(SMTP_PORT),
    SMTP_USER,
    SMTP_PASS,
  };
}
