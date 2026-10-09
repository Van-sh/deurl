import Elysia, { problem, StatusMap } from "elysia";

import type { ResponseSchema } from "~api/types";
import { authPlugin } from "~feat/auth/server/api/auth.plugin";
import { LinkModels } from "./links.models";
import { LinkService } from "./links.service";

export const linksRouter = new Elysia({
   name: "links",
   prefix: "/links",
})
   .use(authPlugin)
   .guard({ schema: "merge", auth: true })
   .get(
      "/",
      {
         response: {
            [StatusMap["OK"]]: LinkModels.getAllLinksResponse,
         } satisfies ResponseSchema,
      },
      async ({ user, status }) => {
         const links = await LinkService.getAllLinksForUser(user.id);

         return status("OK", links);
      },
   )
   .post(
      "/",
      {
         body: LinkModels.createLinkBody,
         response: {
            [StatusMap["OK"]]: LinkModels.linkSuccess,
            [StatusMap["Forbidden"]]: LinkModels.createLinkForbidden,
         },
      },
      async ({ body, user, status }) => {
         if (user.isAnonymous) {
            if (body.customCode) {
               return problem("Forbidden", { detail: "Anonymous Users cannot add custom codes" });
            }
            const linkCount = await LinkService.getLinkCountForUser(user.id);
            if (linkCount >= 1) {
               return problem("Forbidden", { detail: "Anonymous Users can only have one URL" });
            }
         }

         const newLink = await LinkService.registerUrl(user.id, body.url, body.customCode);
         return status("OK", newLink);
      },
   )
   .patch(
      "/:id",
      {
         params: LinkModels.linkIdParams,
         body: LinkModels.createLinkBody,
         response: {
            [StatusMap["OK"]]: LinkModels.linkSuccess,
            [StatusMap["Forbidden"]]: LinkModels.editLinkForbidden,
         },
      },
      async ({ params, body, user, status }) => {
         const linkId = params.id;

         const thisLink = await LinkService.getLinkForUser(user.id, linkId);
         if (!thisLink) {
            return problem("Forbidden", { detail: "You don't own this link" });
         }

         let editedLink;
         if (user.isAnonymous) {
            if (body.customCode) {
               return problem("Forbidden", { detail: "Anonymous Users cannot edit custom codes" });
            }

            editedLink = await LinkService.editLink(user.id, linkId, body.url);
         } else {
            editedLink = await LinkService.editLink(user.id, linkId, body.url, body.customCode);
         }

         return status("OK", editedLink);
      },
   )
   .delete(
      "/:id",
      {
         params: LinkModels.linkIdParams,
         response: {
            [StatusMap["OK"]]: LinkModels.deleteLinkSuccess,
         } satisfies ResponseSchema,
      },
      async ({ params, user, status }) => {
         await LinkService.deleteLinkForUser(user.id, params.id);

         return status("OK", { message: "Link deleted" });
      },
   );
