import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { authClient } from "~/lib/auth-client";
import { createLinkOptions } from "~/query/link";

export const Route = createLazyFileRoute("/_app/")({
   component: LandingRouteComponent,
});

function LandingRouteComponent() {
   const navigate = Route.useNavigate();
   const [url, setUrl] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [isAnonSigningIn, setIsAnonSigningIn] = useState(false);
   const hasTriggeredAnonRef = useRef(false);
   const inputRef = useRef<HTMLInputElement | null>(null);

   const { data: session, isPending: isSessionPending } = authClient.useSession();

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   const { mutateAsync, isPending: isCreating } = useMutation(
      createLinkOptions(
         () => {
            setUrl("");
            void navigate({ to: "/dashboard" });
            toast.success("URL successfully created");
         },
         (mutateError) => {
            toast.error(
               mutateError instanceof Error ? mutateError.message : "Something went wrong.",
            );
         },
      ),
   );

   const isSubmitting = isCreating || isAnonSigningIn;
   const canSubmit = !!session && !isSessionPending && !isSubmitting && url.trim().length > 0;

   function handleChange(next: string) {
      setUrl(next);
      setError(null);

      if (!hasTriggeredAnonRef.current && !session && !isSessionPending && next.trim().length > 0) {
         hasTriggeredAnonRef.current = true;
         setIsAnonSigningIn(true);
         void authClient.signIn
            .anonymous()
            .catch(() => {
               setError("Could not start an anonymous session. Please try again.");
               hasTriggeredAnonRef.current = false;
            })
            .finally(() => {
               setIsAnonSigningIn(false);
            });
      }
   }

   async function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      setError(null);

      const trimmed = url.trim();
      if (!trimmed) return;

      try {
         new URL(trimmed);
      } catch {
         toast.error("Please enter a valid URL.");
         return;
      }

      if (!session || isSessionPending) {
         return;
      }

      await mutateAsync(trimmed);
   }

   return (
      <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4">
         <div className="w-full max-w-xl">
            <Card className="shadow-lg">
               <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                     Shorten links in a single step
                  </CardTitle>
                  <CardDescription>
                     Paste any URL below. We{"'"}ll create a short link and send you to your
                     dashboard.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-3">
                     <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                           ref={inputRef}
                           // type="url"
                           autoComplete="off"
                           placeholder="https://example.com/some/long/link"
                           value={url}
                           onChange={(event) => handleChange(event.target.value)}
                           aria-invalid={!!error}
                        />
                        <Button type="submit" className="shrink-0 sm:w-32" disabled={!canSubmit}>
                           {isSubmitting ? "Working..." : "Shorten"}
                        </Button>
                     </div>
                     <p className="text-xs text-muted-foreground">
                        Start typing to create an anonymous workspace. You can always link your
                        account later.
                     </p>
                     {error && <p className="text-xs text-destructive">{error}</p>}
                  </form>
               </CardContent>
            </Card>
         </div>
      </main>
   );
}
