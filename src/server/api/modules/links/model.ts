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

export const LinkModel = {
   getAllLinksResponse: t.Array(link),

   createLinkBody: t.Object({
      url: t.String({ format: "url" }),
      customCode: t.Optional(t.String()),
   }),

   createLinkSuccess: link,
   createLinkForbidden: t.Object({
      message: t.Union([
         t.Literal("Anonymous Users cannot add custom codes"),
         t.Literal("Anonymous Users can only have one URL"),
      ]),
   }),
} as const;

export type LinkModel = {
   [k in keyof typeof LinkModel]: UnwrapSchema<(typeof LinkModel)[k]>;
};
