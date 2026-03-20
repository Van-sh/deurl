import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSession } from "~/lib/auth.functions";
import { getAllLinkOptions } from "~/query/link";

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
