import "~/logtape.config";

import { getLogger } from "@logtape/drizzle-orm";
import { drizzle } from "drizzle-orm/libsql/web";

import { env } from "~/env";
import * as schema from "./schema";
import { authRelations } from "./schema/auth.schema";
import { relations } from "./schema/relations";

export const db = drizzle({
   connection: {
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
   },
   schema,
   relations: { ...relations, ...authRelations },
   logger: getLogger({
      category: ["server", "db"],
   }),
});
