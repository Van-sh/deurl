import "@tanstack/react-start/server";

import { createFileRoute } from "@tanstack/react-router";

import { app } from "~/server/api";

const handle = ({ request }: { request: Request }) => app.fetch(request);
export const Route = createFileRoute("/api/$")({
   server: {
      handlers: {
         GET: handle,
         POST: handle,
         PATCH: handle,
         DELETE: handle,
      },
   },
});
