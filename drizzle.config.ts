import { defineConfig } from "drizzle-kit";

import { env } from "~/env";

export default defineConfig({
   out: "./migrations",
   schema: "./src/server/db/schema/index.ts",
   dialect: "turso",
   dbCredentials: {
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
   },
});
