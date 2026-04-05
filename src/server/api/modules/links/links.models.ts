import { t, type UnwrapSchema } from "elysia";

const link = t.Object({
   id: t.Integer(),
   code: t.String(),
   originalUrl: t.String(),
   clickCount: t.Integer(),
   createdAt: t.Date(),
   updatedAt: t.Date(),
});
export type Link = typeof link.static;

export const LinkModels = {
   getAllLinksResponse: t.Array(link),

   createLinkBody: t.Object({
      url: t.String({ format: "url" }),
      customCode: t.Optional(t.String()),
   }),

   linkSuccess: link,
   createLinkForbidden: t.Object({
      message: t.Union([
         t.Literal("Anonymous Users cannot add custom codes"),
         t.Literal("Anonymous Users can only have one URL"),
      ]),
   }),

   patchLinkForbidden: t.Object({
      message: t.Union([
         t.Literal("Anonymous Users cannot edit custom codes"),
         t.Literal("You don't own this link"),
      ]),
   }),

   deleteLinkParams: t.Object({
      id: t.Numeric(),
   }),
   deleteLinkSuccess: t.Object({
      message: t.Literal("Link deleted"),
   }),
} as const;

export type LinkModels = {
   [K in keyof typeof LinkModels]: UnwrapSchema<(typeof LinkModels)[K]>;
};
