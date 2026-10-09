import { Elysia, problem, StatusMap, t } from "elysia";

import { auth } from "~/lib/auth";
import type { ResponseSchema } from "~/server/api/types";

export const authPlugin = new Elysia({ name: "better-auth" }).macro({
   auth: {
      async derive({ request: { headers } }) {
         const session = await auth.api.getSession({
            headers,
         });

         if (!session) return problem("Unauthorized", { detail: "Unauthorized" });

         return {
            user: session.user,
            session: session.session,
         };
      },
      response: {
         [StatusMap["Unauthorized"]]: t.Problem({ detail: t.Literal("Unauthorized") }),
      } satisfies ResponseSchema,
   },
});
