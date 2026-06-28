import { getLogger } from "@logtape/logtape";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "~db";
import { link } from "~db/schema";

const logger = getLogger(["server", "redirect"]);

const getRedirectUrl = createServerFn({ method: "GET" })
   .validator(
      z.object({
         code: z.base64url(),
      }),
   )
   .handler(async ({ data: { code } }) => {
      const res = await db
         .select({
            linkId: link.id,
            redirectUrl: link.originalUrl,
         })
         .from(link)
         .where(eq(link.code, code));

      if (res.length === 0) {
         return undefined;
      }

      const { linkId, redirectUrl } = res[0];

      logger.info`Redirecting ${code} -> ${redirectUrl}`;

      db.update(link)
         .set({ clickCount: sql<number>`${link.clickCount} + 1` })
         .where(eq(link.id, linkId))
         .execute();

      return redirectUrl;
   });

export const Route = createFileRoute("/(redirects)/l/$code")({
   async beforeLoad({ params: { code } }) {
      const redirectUrl = await getRedirectUrl({ data: { code } });

      if (!redirectUrl) {
         throw notFound({ routeId: Route.id });
      }
      throw redirect({ href: redirectUrl });
   },
   notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
   const params = Route.useParams();
   return (
      <main className="flex h-full w-full flex-col items-center justify-center gap-8">
         <h1 className="text-9xl">404</h1>
         <span className="text-xl">
            <code className="rounded-sm bg-accent p-1">{params.code}</code> is not a link
         </span>
      </main>
   );
}
