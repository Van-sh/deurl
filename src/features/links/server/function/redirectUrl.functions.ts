import { getLogger } from "@logtape/logtape";
import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "~db";
import { link } from "~db/schema";

const logger = getLogger(["server", "redirect"]);

export const getRedirectUrl = createServerFn({ method: "GET" })
   .validator(
      z.object({
         code: z.base64url(),
      }),
   )
   .handler(async ({ data: { code } }) => {
      const res = await db
         .select({
            linkId: link.id,
            redirectUrl: link.originalUrl,
         })
         .from(link)
         .where(eq(link.code, code));

      if (res.length === 0) {
         return undefined;
      }

      const { linkId, redirectUrl } = res[0];

      logger.info`Redirecting ${code} -> ${redirectUrl}`;

      db.update(link)
         .set({ clickCount: sql<number>`${link.clickCount} + 1` })
         .where(eq(link.id, linkId))
         .execute();

      return redirectUrl;
   });
