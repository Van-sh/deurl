import { defineRelations } from "drizzle-orm";

import * as schema from ".";

export const relations = defineRelations(schema, (r) => ({
   link: {
      creator: r.one.user({
         from: r.link.userId,
         to: r.user.id,
      }),
   },
}));
