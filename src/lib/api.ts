import { treaty } from "@elysiajs/eden";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { env } from "~/env";
import { app } from "~/server/api";

export const api = createIsomorphicFn()
   .server(() => treaty(app, { headers: getRequestHeaders() }).api)
   .client(
      () =>
         treaty<typeof app>(env.VITE_API_URL, {
            fetch: {
               credentials: "include",
            },
         }).api,
   );
