import { createLazyFileRoute } from "@tanstack/react-router";

import { Skeleton } from "~/components/ui/skeleton";
import CreateLink from "~feat/links/components/CreateLink";
import { LinksTable } from "~feat/links/components/LinksTable";

export const Route = createLazyFileRoute("/_app/dashboard")({
   component: DashboardRouteComponent,
   pendingComponent: DashboardPending,
   errorComponent: DashboardError,
});

function DashboardRouteComponent() {
   return (
      <main className="px-4 py-6">
         <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
               <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-semibold tracking-tight">Your links</h1>
                  <p className="text-sm text-muted-foreground">
                     All the links you{"'"}ve shortened, in one place.
                  </p>
               </div>
               <CreateLink />
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
