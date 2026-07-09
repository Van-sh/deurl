import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { getRedirectUrl } from "~feat/links/server/function/redirectUrl.functions";

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
