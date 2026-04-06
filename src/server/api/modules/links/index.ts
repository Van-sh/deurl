import Elysia, { StatusMap } from "elysia";

import type { ResponseSchema } from "~api/types";
import { authPlugin } from "../auth/auth.plugin";
import { LinkModels } from "./links.models";
import { LinkService } from "./links.service";

export const linksRouter = new Elysia({
   name: "links",
   prefix: "/links",
})
   .use(authPlugin)
   .guard({ auth: true })
   .get(
      "/",
      async ({ user, status }) => {
         const links = await LinkService.getAllLinksForUser(user.id);

         return status("OK", links);
      },
      {
         response: {
            [StatusMap["OK"]]: LinkModels.getAllLinksResponse,
         } satisfies ResponseSchema,
      },
   )

   .post(
      "/",
      async ({ body, user, status }) => {
         if (user.isAnonymous) {
            if (body.customCode) {
               throw status("Forbidden", { message: "Anonymous Users cannot add custom codes" });
            }
            const linkCount = await LinkService.getLinkCountForUser(user.id);
            if (linkCount >= 1) {
               throw status("Forbidden", { message: "Anonymous Users can only have one URL" });
            }
         }

         const newLink = await LinkService.registerUrl(user.id, body.url, body.customCode);
         return status("OK", newLink);
      },
      {
         body: LinkModels.createLinkBody,
         response: {
            [StatusMap["OK"]]: LinkModels.linkSuccess,
            [StatusMap["Forbidden"]]: LinkModels.createLinkForbidden,
         },
      },
   )

   .patch(
      "/:id",
      async ({ params, body, user, status }) => {
         const linkId = params.id;

         const thisLink = await LinkService.getLinkForUser(user.id, linkId);
         if (!thisLink) {
            throw status("Forbidden", { message: "You don't own this link" });
         }

         let editedLink;
         if (user.isAnonymous) {
            if (body.customCode) {
               throw status("Forbidden", { message: "Anonymous Users cannot edit custom codes" });
            }

            editedLink = await LinkService.editLink(user.id, linkId, body.url);
         } else {
            editedLink = await LinkService.editLink(user.id, linkId, body.url, body.customCode);
         }

         return status("OK", editedLink);
      },
      {
         params: LinkModels.linkIdParams,
         body: LinkModels.createLinkBody,
         response: {
            [StatusMap["OK"]]: LinkModels.linkSuccess,
            [StatusMap["Forbidden"]]: LinkModels.editLinkForbidden,
         },
      },
   )

   .delete(
      "/:id",
      async ({ params, user, status }) => {
         await LinkService.deleteLinkForUser(user.id, params.id);

         return status("OK", { message: "Link deleted" });
      },
      {
         params: LinkModels.linkIdParams,
         response: {
            [StatusMap["OK"]]: LinkModels.deleteLinkSuccess,
         } satisfies ResponseSchema,
      },
   );
