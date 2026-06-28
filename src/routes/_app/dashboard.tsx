import { createFileRoute, redirect } from "@tanstack/react-router";

import { getAllLinkOptions } from "~/query/link";
import { getSession } from "~api/modules/auth/auth.functions";

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
