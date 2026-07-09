import { Elysia, StatusMap, t } from "elysia";

import { auth } from "~/lib/auth";
import type { ResponseSchema } from "~/server/api/types";

export const authPlugin = new Elysia({ name: "better-auth" }).macro({
   auth: {
      async derive({ status, request: { headers } }) {
         const session = await auth.api.getSession({
            headers,
         });

         if (!session) throw status("Unauthorized", { message: "Unauthorized" });

         return {
            user: session.user,
            session: session.session,
         };
      },
      response: {
         [StatusMap["Unauthorized"]]: t.Object({ message: t.Literal("Unauthorized") }),
      } satisfies ResponseSchema,
   },
});
