import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
   server: {
      NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

      BETTER_AUTH_SECRET: z.string(),
      BETTER_AUTH_URL: z.url(),
      TURSO_DATABASE_URL: z.url(),
      TURSO_AUTH_TOKEN: z.string(),

      GOOGLE_CLIENT_ID: z.string(),
      GOOGLE_CLIENT_SECRET: z.string(),
   },

   /**
    * The prefix that client-side variables must have. This is enforced both at
    * a type-level and at runtime.
    */
   clientPrefix: "VITE_",

   client: {
      VITE_APP_NAME: z.string(),
      VITE_API_URL: z.url(),
      VITE_LOG_LEVEL: z.enum(["trace", "debug", "info", "warning", "error", "fatal"]),
   },

   /**
    * What object holds the environment variables at runtime. This is usually
    * `process.env` or `import.meta.env`.
    */
   runtimeEnv: {
      ...process.env,
      ...import.meta.env,
      BETTER_AUTH_URL: process.env.VITE_APP_URL,
      VITE_API_URL: import.meta.env.VITE_APP_URL,

      VITE_LOG_LEVEL: process.env.NODE_ENV === "development" ? "debug" : "info",
   },

   /**
    * By default, this library will feed the environment variables directly to
    * the Zod validator.
    *
    * This means that if you have an empty string for a value that is supposed
    * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
    * it as a type mismatch violation. Additionally, if you have an empty string
    * for a value that is supposed to be a string with a default value (e.g.
    * `DOMAIN=` in an ".env" file), the default value will never be applied.
    *
    * In order to solve these issues, we recommend that all new projects
    * explicitly specify this option as true.
    */
   emptyStringAsUndefined: true,
});
