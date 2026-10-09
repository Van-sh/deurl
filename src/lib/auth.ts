import "@tanstack/react-start/server-only";

import { betterAuth, type Logger } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~db";
import * as schema from "~db/schema";

const envToLogger = {
   development: {
      disabled: false,
      level: "debug",
   },
   production: {
      disabled: false,
   },
   test: {
      disabled: true,
   },
} as const satisfies Record<typeof env.NODE_ENV, Logger>;

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
   logger: envToLogger[env.NODE_ENV],
   advanced: {
      database: { validateSchema: false },
   },
});
