import "~/logtape.config";

import { getLogger } from "@logtape/drizzle-orm";

import { env } from "~/env";
import * as schema from "./schema";
import { authRelations } from "./schema/auth.schema";
import { relations } from "./schema/relations";

const { drizzle } = await (env.TURSO_DATABASE_URL.startsWith("file")
   ? import("drizzle-orm/libsql/node")
   : import("drizzle-orm/libsql/web"));

export const db = drizzle({
   connection: {
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
   },
   schema,
   relations: { ...relations, ...authRelations },
   logger: getLogger({
      category: ["server", "db"],
      dialect: "sqlite",
   }),
});
