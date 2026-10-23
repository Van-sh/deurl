import "@tanstack/react-start/server-only";

import { getLogger } from "@logtape/logtape";
import { betterAuth, type LogLevel } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~db";
import * as schema from "~db/schema";

const betterAuthlogger = getLogger(["server", "better-auth"]);

export const auth = betterAuth({
   secret: env.BETTER_AUTH_SECRET,
   baseURL: env.BETTER_AUTH_URL,
   database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
   }),
   socialProviders: {
      google: {
         clientId: env.GOOGLE_CLIENT_ID,
         clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
   },
   plugins: [
      anonymous({
         async onLinkAccount({ anonymousUser, newUser }) {
            await db
               .update(schema.link)
               .set({ userId: newUser.user.id })
               .where(eq(schema.link.userId, anonymousUser.user.id));
         },
      }),
      tanstackStartCookies(),
   ],
   logger: {
      disabled: false,
      level: env.NODE_ENV === "production" ? "info" : "debug",
      log(level: Exclude<LogLevel, "success">, message: string, ...args: any[]) {
         betterAuthlogger[level](message, { args });
      },
   },
   advanced: {
      database: { validateSchema: false },
   },
});
