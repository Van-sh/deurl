import { and, eq, getColumns } from "drizzle-orm";

import { db } from "~/server/db";
import { link } from "~/server/db/schema";
import { toBase64Url } from "~api/lib/toBase64Url";

const { userId: _, ...linkColumns } = getColumns(link);

export abstract class LinkService {
   static async getAllLinksForUser(userId: string) {
      const links = await db.select(linkColumns).from(link).where(eq(link.userId, userId));
      return links;
   }

   static async getLinkForUser(userId: string, linkId: number) {
      const [thisLink] = await db
         .select(linkColumns)
         .from(link)
         .where(and(eq(link.userId, userId), eq(link.id, linkId)))
         .limit(1);

      if (!thisLink) {
         return null;
      }

      return thisLink;
   }

   static async getLinkCountForUser(userId: string) {
      const count = await db.$count(link, eq(link.userId, userId));

      return count;
   }

   static async getLinkCountForUrl(url: string) {
      const count = await db.$count(link, eq(link.originalUrl, url));

      return count;
   }

   static async registerUrl(userId: string, url: string, customCode?: string) {
      if (!customCode) {
         return this.registerUrlWithoutCustomCode(userId, url);
      }

      const [newLink] = await db
         .insert(link)
         .values({
            originalUrl: url,
            code: customCode,
            userId,
         })
         .returning(linkColumns);

      return newLink;
   }

   static async registerUrlWithoutCustomCode(userId: string, url: string) {
      return await db.transaction(async (tx) => {
         const [newLinkTmp] = await tx
            .insert(link)
            .values({
               originalUrl: url,
               code: "",
               userId,
            })
            .returning({ id: link.id });

         const hash = Bun.hash.wyhash(url, BigInt(newLinkTmp.id));

         const code = toBase64Url(hash);
         const [newLink] = await tx
            .update(link)
            .set({ code })
            .where(eq(link.id, newLinkTmp.id))
            .returning(linkColumns);

         return newLink;
      });
   }

   static async patchLink(userId: string, linkId: number, url: string, customCode?: string) {
      const [patchedLink] = await db
         .update(link)
         .set({ originalUrl: url, code: customCode })
         .where(and(eq(link.userId, userId), eq(link.id, linkId)))
         .returning(linkColumns);

      return patchedLink;
   }

   static async deleteLinkForUser(userId: string, linkId: number) {
      await db.delete(link).where(and(eq(link.id, linkId), eq(link.userId, userId)));
   }
}
