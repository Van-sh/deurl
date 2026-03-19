import "~/logtape.config";

import { elysiaLogger } from "@logtape/elysia";
import Elysia from "elysia";

import { linksRouter } from "./modules/links";

export const app = new Elysia({
   prefix: "/api",
})
   .use(
      elysiaLogger({
         category: ["server", "elysia"],
         format: "dev",
         scope: "global",
      }),
   )
   .use(linksRouter);
