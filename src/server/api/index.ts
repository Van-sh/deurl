import "~/logtape.config";

import { elysiaLogger } from "@logtape/elysia";
import Elysia from "elysia";

import { env } from "~/env";
import { linksRouter } from "./modules/links";

export const app = new Elysia({
   prefix: "/api",
})
   .use(
      elysiaLogger({
         category: ["server", "elysia"],
         format: env.NODE_ENV === "production" ? "structured-combined" : "dev",
         scope: "global",
         context: true,
      }),
   )
   .use(linksRouter);
