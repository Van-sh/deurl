import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSession } from "~feat/auth/server/functions/auth.functions";
import { getAllLinkOptions } from "~feat/links/queries/links.queries";

export const Route = createFileRoute("/_app/dashboard")({
   async loader({ context }) {
      const session = await getSession();
      if (!session) {
         throw redirect({ to: "/login" });
      }

      await context.queryClient.prefetchQuery(getAllLinkOptions);
      return {};
   },
});
