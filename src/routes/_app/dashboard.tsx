import { createFileRoute, redirect } from "@tanstack/react-router";

import { LinksTable } from "~/components/LinksTable";
import { Skeleton } from "~/components/ui/skeleton";
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
   component: DashboardRouteComponent,
   pendingComponent: DashboardPending,
   errorComponent: DashboardError,
});

function DashboardRouteComponent() {
   return (
      <main className="px-4 py-6">
         <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <header className="space-y-1">
               <h1 className="text-2xl font-semibold tracking-tight">Your links</h1>
               <p className="text-sm text-muted-foreground">
                  All the links you{"'"}ve shortened, in one place.
               </p>
            </header>
            <section className="rounded-xl border bg-card p-4">
               <LinksTable />
            </section>
         </div>
      </main>
   );
}

function DashboardPending() {
   return (
      <main className="px-4 py-6">
         <div className="mx-auto max-w-5xl space-y-4">
            <div className="space-y-2">
               <Skeleton className="h-6 w-40" />
               <Skeleton className="h-4 w-72" />
            </div>
            <section className="space-y-2 rounded-xl border bg-card p-4">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-[90%]" />
               <Skeleton className="h-4 w-[85%]" />
            </section>
         </div>
      </main>
   );
}

function DashboardError() {
   return (
      <main className="px-4 py-6">
         <div className="mx-auto max-w-5xl space-y-2">
            <h1 className="text-lg font-semibold">Couldn{"'"}t load your links</h1>
            <p className="text-sm text-muted-foreground">
               Please refresh the page or try again in a moment.
            </p>
         </div>
      </main>
   );
}
