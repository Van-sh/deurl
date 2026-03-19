import { createTable } from "../utils/table";
import { timestamps } from "../utils/timestamp.schema";
import { user } from "./auth.schema";

export const link = createTable("link", (t) => ({
   id: t.integer().primaryKey(),
   code: t.text().unique().notNull(),
   originalUrl: t.text().notNull(),
   userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
   clickCount: t.integer().notNull().default(0),
   ...timestamps,
}));
